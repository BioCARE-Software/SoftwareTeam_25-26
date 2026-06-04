// main.c
// Main application file...
// TODO: need to refactor by SEPARATING FILTER IMPLEMENTATION into diff. file!!

#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include "esp_timer.h"
#include "freertos/FreeRTOS.h" // KEEP THIS (some editors warn that not used directly but still need for BaseType_t and TickType_t, e.g.)
#include "freertos/task.h"

#include "functions.h"

// GLOBALS
float alpha = 0.1;
float filtered_val = 0.0;

void app_main(void) {
    run_filter_test();
}

float get_raw_sensor_data(void) {
    float time = (float)esp_timer_get_time() / 1000000.0;
    float clean_signal = 100.0 + 50.0 * sin(time);
    float noise = (float)(rand() % 20) - 10.0;
    return clean_signal + noise;
}

void run_filter_test(void) {
    while (1) {
        float raw = get_raw_sensor_data();

        // first order EMA filter
        // see this for ref: https://blog.mbedded.ninja/programming/signal-processing/digital-filters/exponential-moving-average-ema-filter/
        // simplest and most memory-efficient thing I found... will have to do ML on controller later, I think? so let's keep it basic
        // decrease alpha signal for smoother response, increase for coarser ("filter strength," basically)
        filtered_val = (alpha * raw) + ((1.0 - alpha) * filtered_val);

        printf("%.2f, %.2f\n", raw, filtered_val);
        vTaskDelay(pdMS_TO_TICKS(50));
    }
}
