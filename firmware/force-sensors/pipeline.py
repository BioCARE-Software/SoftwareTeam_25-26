import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from scipy.signal import butter, filtfilt
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

# ---- Config ----
FS = 200

files = {
    'rest':      './data/data_rest.csv',
    'position1': './data/data_position1.csv',
    'position2': './data/data_position2.csv',
    'position3': './data/data_position3.csv',
    # 'position4': './data/data_position4.csv'
}

WINDOW_SIZE = 40
STEP_SIZE   = 20

# filter and normalize
def lowpass(data, fs=FS, high=10):
    b, a = butter(4, high, btype='low', fs=fs)
    return filtfilt(b, a, data)

def global_normalize(data, gmin, gmax):
    return (data - gmin) / (gmax - gmin + 1e-6)

# fig, axes = plt.subplots(5, 1, figsize=(12, 10))
fig, axes = plt.subplots(4, 1, figsize=(12, 10))
dataframes = {}

# load and filter all data to show the lowpass values
for label, file in files.items():
    df = pd.read_csv(file)
    df['filtered'] = lowpass(df['raw_value'].values)
    dataframes[label] = df

# compute global min/max across all filtered data after loading everything
all_filtered = np.concatenate([df['filtered'].values for df in dataframes.values()])
global_min = float(np.min(all_filtered))
global_max = float(np.max(all_filtered))
print(f"Global min: {global_min:.2f}, max: {global_max:.2f}")

# normalize and plot
for ax, (label, df) in zip(axes, dataframes.items()):
    df['normalized'] = global_normalize(df['filtered'].values, global_min, global_max)

    ax.plot(df['timestamp_ms'], df['raw_value'], alpha=0.4, label='raw')
    ax.plot(df['timestamp_ms'], df['filtered'],  alpha=0.8, label='filtered')
    ax.set_ylabel('ADC value')
    ax.set_title(label)

    ax2 = ax.twinx()
    ax2.plot(df['timestamp_ms'], df['normalized'],
             color='green', alpha=0.8, label='normalized')
    ax2.set_ylabel('normalized (0-1)', color='green')
    ax2.set_ylim(0, 1)
    ax2.tick_params(axis='y', labelcolor='green')

    lines1, labels1 = ax.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax.legend(lines1 + lines2, labels1 + labels2,
              loc='upper right', fontsize=7)

# feature extraction
def extract_features(window):
    slope = np.polyfit(range(len(window)), window, 1)[0]
    return {
        'mean':         np.mean(window),
        'max':          np.max(window),
        'min':          np.min(window),
        'std':          np.std(window),
        'range':        np.max(window) - np.min(window),
        'slope':        slope,
        'energy':       np.sum(np.square(window)),
        'median':       np.median(window),
        'peak_to_peak': np.max(window) - np.min(window),
        'rms':          np.sqrt(np.mean(np.square(window))),
        'skewness':     pd.Series(window).skew(),
        'kurtosis':     pd.Series(window).kurt()
    }

rows = []
for label, df in dataframes.items():
    signal = df['normalized'].values
    for i in range(0, len(signal) - WINDOW_SIZE, STEP_SIZE):
        window = signal[i:i + WINDOW_SIZE]
        features = extract_features(window)
        features['label'] = label
        rows.append(features)

dataset = pd.DataFrame(rows)
print(f"Dataset shape: {dataset.shape}")
print(dataset['label'].value_counts())

# train classifier
X = dataset.drop('label', axis=1)
y = dataset['label']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

clf = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    min_samples_leaf=3,
    random_state=42
)

clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# filter+normalize plot
fig.suptitle('Filter + Normalize', fontsize=14)
plt.tight_layout()
# plt.show()

# confusion matrix
cm = confusion_matrix(y_test, y_pred, labels=list(files.keys()))
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d',
            xticklabels=files.keys(),
            yticklabels=files.keys(),
            cmap='Blues')
plt.title('Confusion Matrix')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.tight_layout()
plt.show() # show the plot and confusion matrix

# feature extraction
importances = pd.Series(clf.feature_importances_, index=X.columns)
importances.sort_values().plot(kind='barh', figsize=(8, 6))
plt.title('Feature Importances')
plt.xlabel('Importance')
plt.tight_layout()
plt.show() 

# save model with normalization params
joblib.dump({
    'model':      clf,
    'global_min': global_min,
    'global_max': global_max
}, 'gesture_classifier.pkl')
print(f"Model saved. Global min: {global_min:.2f}, max: {global_max:.2f}")
