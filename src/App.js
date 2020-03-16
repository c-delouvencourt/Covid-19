import React, {Component} from 'react';
import France from "./Carte/France";
import {readRemoteFile} from 'react-papaparse'
import {RegionToDepartement} from "./Utils/RegionToDepartement";
import Trend from 'react-trend';

export default class App extends Component {

    state = {
        loading: true, data: undefined, dpts: []
    };

    componentDidMount() {
        const self = this;
        readRemoteFile("https://www.data.gouv.fr/fr/datasets/r/fa9b8fc8-35d5-4e24-90eb-9abe586b0fa5", {
                complete: function (results) {
                    console.log(results);

                    let first = true;
                    let dpts = [];
                    results.data[0].map(data => {
                        if (!first) {
                            dpts.push(RegionToDepartement.getByRegion(data));
                        } else first = false;
                    });

                    let first2 = true;
                    let cas = [];
                    results.data[results.data.length - 2].map(data => {
                        if (!first2) {
                            cas.push(data);
                        } else first2 = false;
                    });

                    let regions = results.data[0];
                    regions.shift();
                    let casPerDepts = {};
                    for (let i = 0; i < dpts.length; i++) {
                        casPerDepts[regions[i]] = {
                            "cas": cas[i],
                            "departements": dpts[i]
                        };
                    }

                    let casHier = [];
                    let first5 = true;
                    results.data[results.data.length - 3].map(data => {
                        if (!first5) {
                            casHier.push(data);
                        } else first5 = false;
                    });

                    console.log(casPerDepts);

                    let q1 = 0;
                    let q3 = 0;
                    let average = 0;

                    let sum = 0;
                    let sumVeille = 0;

                    Object.values(casPerDepts).map(v => sum += parseInt(v.cas));

                    let first3 = true;
                    results.data[results.data.length - 3].map(data => {
                        if (!first3) {
                            sumVeille += parseInt(data);
                        } else first3 = false;
                    });

                    average = sum / Object.entries(casPerDepts).length;
                    q1 = average / 2;
                    q3 = average + (average / 2);

                    console.log("Somme", average);
                    console.log("Moyenne", average);
                    console.log("Q1", q1);
                    console.log("Q3", q3);


                    let dptsTouches = [];
                    for (let [key, value] of Object.entries(casPerDepts)) {
                        if (value["cas"] > 0) {
                            value["departements"].map(dpt => {
                                let color = RegionToDepartement.getColorByIntensity(0);

                                if (value["cas"] < q1 && value["cas"] > 0) color = RegionToDepartement.getColorByIntensity(1);
                                else if (value["cas"] > q1 && value["cas"] < average) color = RegionToDepartement.getColorByIntensity(2);
                                else if (value["cas"] > average && value["cas"] < q3) color = RegionToDepartement.getColorByIntensity(3);
                                else if (value["cas"] > q3) color = RegionToDepartement.getColorByIntensity(4);

                                dptsTouches.push({code: dpt, color: color});
                            });
                        }
                    }

                    console.log(dptsTouches);

                    let trends = [];
                    for (let i = 1; i < results.data.length - 1; i++){
                        let sum = 0;
                        for (let j = 1; j < results.data[i].length - 1; j++){
                            sum += parseInt(results.data[i][j]);
                        }
                        trends.push(sum);
                    }

                    console.log(trends);

                    self.setState({
                        loading: false, data: results.data, dpts, dptsTouches, casPerDepts,
                        stats: {
                            france: sum,
                            date: results.data[results.data.length - 2][0],
                            evolution: sumVeille,
                            casHier,
                            trends
                        }
                    })
                }
            }
        )
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            );
        }

        return (
            <div className="container" style={{paddingTop: 50}}>
                <div className="columns">
                    <div className="column is-6 is-12-mobile">
                        <h5 className="title is-5 has-text-white" style={{marginBottom: 50}}>Evolution des cas de
                            CoVid-19 <span className="tag is-danger" style={{marginLeft: 20}}>EN DIRECT</span></h5>
                        <France departements={this.state.dptsTouches}/>
                    </div>
                    <div className="column is-6 is-12-mobile">
                        <div className="columns">
                            <div className="column is-6 is-12-mobile">
                                <div className="card">
                                    <div className="card-content">
                                        <h5 className="title is-5">Nombre de cas en France</h5>
                                        <h1 className="subtitle is-1"  style={{marginBottom: 10}}>{this.state.stats.france}</h1>
                                        <span className="tag is-danger">+{this.state.stats.france - this.state.stats.evolution} par rapport à hier</span>
                                    </div>
                                </div>
                            </div>
                            <div className="column is-6 is-12-mobile">
                                <Trend
                                    height={169}
                                    width={318}
                                    autoDraw
                                    autoDrawEasing="ease-in"
                                    smooth={true}
                                    strokeWidth={3}
                                    gradient={['#ff545b', '#ff002b']}
                                    data={this.state.stats.trends} />
                            </div>
                        </div>
                        <h5 className="title is-5 has-text-white" style={{marginBottom: 30, marginTop: 30}}>Cas par région</h5>
                        <div className="columns is-multiline">
                            {Object.keys(this.state.casPerDepts).map((key, i) => (
                                <div className="column is-4 is-12-mobile">
                                    <div className="card">
                                        <div className="card-content">
                                            <h5 className="title is-5" style={{fontSize: 12}}>{key}</h5>
                                            <h1 className="subtitle is-3"  style={{marginBottom: 10}}>{this.state.casPerDepts[key].cas}</h1>
                                            <span className="tag is-danger">+{this.state.casPerDepts[key].cas - this.state.stats.casHier[i]} par rapport à hier</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
