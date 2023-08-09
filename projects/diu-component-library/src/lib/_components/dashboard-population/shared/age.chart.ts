import Chart from "chart.js/auto";
import { createTooltip, numberWithCommas } from "../../../_functions/helper_charts";
export class AgeChart {

    id;
    chartInstance;

    constructor(sex) {
        this.id = sex;
    }

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
                        position: "nearest",
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
                                    <p style='margin-bottom: 6px;'><b>Age Range: ${tooltip.dataPoints[0].label}</b></p>
                                    <p style='margin-bottom: 0px;'>${numberWithCommas(tooltip.dataPoints[0].raw)} ${this.id as string}s</p>
                                </div>
                            `;
                            tooltipEl.style.opacity = 1;
                        },
                    },
                },
                scales: {
                    // Align to right?
                    x: {
                        ...(this.id === "Male") && {
                            reverse: true
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        ...(this.id === "Male") && {
                            position: "right",
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            },
            data: {
                labels: [],
                datasets: [{
                    label: "Total",
                    barPercentage: 0.9,
                    categoryPercentage: 1.0,
                    borderColor: "#1a6395",
                    backgroundColor: { Male: "#6baed6", Female: "#da3b8a" }[this.id],
                    data: []
                }]
            }
        });
    }

    update(data) {
        // Get data by sex
        const filteredData = this._filterSex(data["AgeDimension"]);

        // Set new data (Initial data set in create for nicer animation)
        this.chartInstance.data.labels = filteredData.map((item) => item.key);
        this.chartInstance.data.datasets[0].data = filteredData.map((item) => {
            return item.value;
        }) || 0;

        // Update chart
        this.chartInstance.update();
    }

    _filterSex(data) {
        // Filter by
        const sexKey = { Female: "F:", Male: "M:" };
        return data.values.filter((item) => {
            return item.key.includes(sexKey[this.id]);
        }).sort((a, b) => {
            return parseInt(b.key.split(":")[1]) - parseInt(a.key.split(":")[1]);
        }).map((item) => {
            item.key = item.key.replace(sexKey[this.id], "");
            return item;
        });
    }
}