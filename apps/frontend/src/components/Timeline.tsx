import {useEffect, useRef, useState} from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts"
import {useQuery,} from 'react-query';
import {useCodeStore, useSessionStore} from "./state.js";
import {Configuration, DefaultApi} from "../openapi";

export const Timeline = (
    props: {
        height: string;
    }
) => {
    const ref = useRef<any>(null);
    const code = useCodeStore((state) => state.code);
    const sessionId = useSessionStore((state) => state.session);
    // useQuery
    const query = useQuery(['timeline'], async () => {
            const api = new DefaultApi(
                new Configuration({
                    basePath: 'http://localhost:5000'
                })
            );
            return  (await api.sessionIdTimelinePost(sessionId, {
                langium: code,
            })).data;
        }, {
            refetchInterval: 1000,
            refetchOnWindowFocus: true
        }
    );


    useEffect(() => {
        // set Timeout to wait for the chart to be rendered

        const timeout = setTimeout(() => {

                const chart = ref.current;
                if (chart) {
                    ApexCharts.exec('chart', 'updateOptions', {
                            plotOptions: {
                                bar: {
                                    horizontal: true,
                                    barHeight: '80%'
                                }
                            }
                        }
                    );
                }
            }
            , 100);
        return () => {
            clearTimeout(timeout);
        }
    }, []);
    const [state,] = useState({

        series: [
            {
                name: 'Sound',
                data: [
                    {
                        x: 'Sound1',
                        y: [
                            50,
                            80
                        ]
                    },
                    {
                        x: 'Sound2',
                        y: [
                            20,
                            50
                        ]
                    },
                    {
                        x: 'Sound3',
                        y: [
                            50,
                            70
                        ]
                    }
                ]
            },
            {
                name: 'Video',
                data: [
                    {
                        x: 'Video1',
                        y: [
                            20,
                            50
                        ]
                    },
                    {
                        x: 'Video2',
                        y: [
                            60,
                            160
                        ],
                        goals: [
                            {
                                name: 'Break',
                                value: 100,
                                strokeColor: '#CD2F2A'
                            }
                        ]
                    },
                    {
                        x: 'Video3',
                        y: [
                            30,
                            70
                        ]
                    },
                    {
                        x: 'Video4',
                        y: [
                            200,
                            220
                        ]
                    }
                ]
            },
            {
                name: 'Text',
                data: [
                    {
                        x: 'Text1',
                        y: [
                            100,
                            170
                        ]
                    },
                    {
                        x: 'Text2',
                        y: [
                            50,
                            90
                        ],
                        goals: [
                            {
                                name: 'Break',
                                value: 70,
                                strokeColor: '#CD2F2A'
                            }
                        ]
                    },
                ]
            }
        ],
        options: {
            chart: {
                id: 'chart',
                height: props.height,
                type: 'rangeBar'
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    barHeight: '80%'
                }
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    formatter: function (value: any, timestamp: string | number | Date, opts: {
                        dateFormatter: (arg0: Date) => {
                            (): any;
                            new(): any;
                            format: {
                                (arg0: string): any;
                                new(): any;
                            };
                        };
                    }) {
                        console.log(value, timestamp, opts);
                        // map to hours and minutes and  seconds from 2019-03-05T00:00:00
                        const totalMilliseconds = value;
                        const milliseconds = Math.floor(totalMilliseconds % 1000);
                        const seconds = Math.floor((totalMilliseconds / 1000) % 60);
                        const minutes = Math.floor((totalMilliseconds / (1000 * 60)) % 60);
                        const hours = Math.floor((totalMilliseconds / (1000 * 60 * 60)) % 24);

                        return hours + ':' + minutes + ':' + seconds + ':' + milliseconds;
                    }
                }
            },
            stroke: {
                width: 1
            },
            fill: {
                type: 'solid',
                opacity: 0.6
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left'
            }
        },


    });
    return (
        <div
            style={{
                width: '100%',
                height: '100%'
            }}
        >
            <div id="chart"
                 style={{
                     width: '100%',
                     height: '100%'
                 }}
                 ref={ref}
            >
                <ReactApexChart
                    options={state.options} series={query.data ? query.data.timeline : state.series} type="rangeBar" height={'100%'}/>
            </div>
            <div id="html-dist"></div>
        </div>
    );

}
