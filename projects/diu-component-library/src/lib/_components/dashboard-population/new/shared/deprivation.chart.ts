import Chart from "chart.js/auto";
import { DeprivationColorCodes } from "./helper";
import { createTooltip } from "../../../../_functions/helper_charts";
import * as d3 from "d3";

export class DeprivationChart {

    id = "Deprivation";
    chartInstance;

    create(htmlElement) {
        // Create new chartjs chart
        this.chartInstance = new Chart(htmlElement.nativeElement, {
            type: "bar",
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: false,
                        xAlign: "left",
                        yAlign: "bottom",
                        external: (context) => {
                            // Tooltip Element
                            const { tooltip } = context;
                            const tooltipEl = createTooltip(context);

                            // Hide if no tooltip
                            if (tooltip.opacity === 0) {
                                tooltipEl.style.opacity = 0;
                                return;
                            }

                            // Tooltip data
                            tooltipEl.querySelector(".body").innerHTML = `
                                <div class='container tip-popup' style='text-align: center'>
                                    <p style='margin-bottom: 6px;'>
                                        <b>Deprivation Value: ${(tooltip.dataPoints[0].dataset as any).title as string}</b></p>
                                    <p style='margin-bottom: 0px;'>${tooltip.dataPoints[0].formattedValue}</p>
                                </div>
                            `;
                            tooltipEl.style.opacity = 1;
                        },
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            },
            data: {
                labels: [""],
                datasets: [...Array(10).keys()].map((item) => {
                    return {
                        data: [],
                        title: item + 1,
                        backgroundColor: DeprivationColorCodes.find(
                            (color) => color.key === (item + 1).toString()
                        )?.color || "#fff"
                    }
                })
            }
        });
    }

    update(data) {
        // Get data by sex
        const filteredData = data["DDimension"].values;

        // Set chart max value
        this.chartInstance.options.scales.x.max = data["AgeDimension"].values.reduce((sum: number, item) => {
            return sum + (item.value as number);
        }, 0);

        // Set new data (Initial data set in create for nicer animation)
        this.chartInstance.data.datasets = this.chartInstance.data.datasets.map((item) => {
            item.data = [
                filteredData.find((data) => {
                    return data.key === item.title;
                })?.value || 0
            ];
            return item;
        });

        // Update chart
        this.chartInstance.update();
    }
}