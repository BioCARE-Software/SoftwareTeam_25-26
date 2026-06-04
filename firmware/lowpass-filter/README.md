So, yeah…

> The exponential moving average (EMA) filter is a simple low-pass filter used in signal processing to smooth data by **emphasising recent values**. Its core formula is a recursive difference equation.

Equation: $y[i]=\alpha\cdot x[i]+(1−\alpha)⋅y[i−1]$

- Lower alpha parameter → smoother response
- Higher alpha parameter → coarser response
- Adjust as needed when testing with EMGs. Will have to be set by experimenting a bit and seeing how the data interpreter responds. As we don't have the ML part up and running yet (I think?) this will have to be adjusted later on, to make sure everything glues nicely together.

After building and flashing, do _not_ run monitor directly from the terminal if you want to see the output graph. Run `readData.py` instead, and it will take care of everything. (That's the script that does the plotting.)

Right now, `get_raw_sensor_data()` is just a mock function. It artificially generates a random signal by adding a base sine wave to some computer-generated noise. Will be real EMG signals soon.

![filter in action](live_filter_scope.gif "Live Filter Scope in Action")