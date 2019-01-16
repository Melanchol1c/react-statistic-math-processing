import React, { Fragment } from "react";
import "./Mann-Whitney.scss";

class MannWhitney extends React.Component {
  state = {
    n: [],
    m: [],
    nMin: 1,
    nMax: 100,
    mMin: 1,
    mMax: 200,
    __key: "val"
  };

  componentWillMount() {
    let { n, m, nMax, nMin, mMax, mMin } = this.state;
    let nArr = [];
    let mArr = [];

    for (let i = 0; i < 400; i++) {
      let num = this.getRndInteger(nMin, nMax);
      nArr = [...nArr, num];
    }
    this.setState({ n: [...n, ...nArr] });

    for (let i = 0; i < 400; i++) {
      let num = this.getRndInteger(mMin, mMax);
      mArr = [...mArr, num];
    }
    this.setState({ m: [...m, ...mArr] });
  }

  calculate = () => {
    let { n, m, nMax, nMin, mMax, mMin } = this.state;
    let nArr = [];
    let mArr = [];

    for (let i = 0; i < 400; i++) {
      let num = this.getRndInteger(nMin, nMax);
      nArr = [...nArr, num];
    }
    this.setState({ n: [...n, ...nArr] });

    for (let i = 0; i < 400; i++) {
      let num = this.getRndInteger(mMin, mMax);
      mArr = [...mArr, num];
    }
    this.setState({ m: [...m, ...mArr] });
  };

  getRndInteger = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  handleInputChange = async e => {
    await this.setState({ [e.target.name]: parseInt(e.target.value) });
    await this.resetState();
    await this.calculate();
  };

  resetState = () => this.setState({ n: [], m: [] });

  rank = list => {
    let __key = this.state.__key;
    // First, sort in ascending order
    list.sort((a, b) => a[__key] - b[__key]);

    // Second, add the rank to the objects
    list = list.map((item, index) => {
      item.rank = index + 1;
      return item;
    });

    // Third, use median values for groups with the same rank
    for (let i = 0; i < list.length; ) {
      let count = 1;
      let total = list[i].rank;

      for (
        let j = 0;
        list[i + j + 1] && list[i + j][__key] === list[i + j + 1][__key];
        j++
      ) {
        total += list[i + j + 1].rank;
        count++;
      }

      let rank = total / count;

      for (let k = 0; k < count; k++) {
        list[i + k].rank = rank;
      }

      i = i + count;
    }

    return list;
  };

  sampleRank = (rankedList, observations) => {
    let __key = this.state.__key;
    // Clone the array
    let __observations = observations.slice(0);

    // Compute the rank
    let rank = 0;
    rankedList.forEach(observation => {
      let index = __observations.indexOf(observation[__key]);
      if (index > -1) {
        // Add the rank to the sum
        rank += observation.rank;

        // Remove the observation from the list
        __observations.splice(index, 1);
      }
    });

    return rank;
  };

  uValue = (rank, observations) => {
    let k = observations.length;
    return rank - (k * (k + 1)) / 2;
  };

  test = samples => {
    let fullSamples = samples[0].length > 0 && samples[1].length > 0;
    if (fullSamples) {
      let __key = this.state.__key;

      if (!Array.isArray(samples)) throw Error("Samples must be an array");
      if (samples.length !== 2)
        throw Error("Samples must contain exactly two samples");

      for (let i = 0; i < 2; i++) {
        if (!samples[i] || samples[i].length === 0)
          throw Error("Samples cannot be empty");
        if (!Array.isArray(samples[i]))
          throw Error("Sample " + i + " must be an array");
      }

      let all = samples[0].concat(samples[1]);

      let unranked = all.map(val => {
        let result = {};
        result[__key] = val;
        return result;
      });

      let ranked = this.rank(unranked);

      let ranks = [];
      for (let i = 0; i < 2; i++) {
        ranks[i] = this.sampleRank(ranked, samples[i]);
      }

      let us = [];
      for (let i = 0; i < 2; i++) {
        us[i] = this.uValue(ranks[i], samples[i]);
      }

      return us;
    }
  };

  check = (u, samples) => {
    let loaded = u && samples[0].length > 0 && samples[1].length > 0;
    if (loaded) {
      return u[0] + u[1] === samples[0].length * samples[1].length;
    }
  };

  methodCheck = (u, samples) => {
    let loaded = u && samples[0].length > 0 && samples[1].length > 0;
    if (loaded) {
      let zCrit = 1.645;
      console.log(`U1 = ${u[0]}`);
      console.log(`U2 = ${u[1]}`);
      console.log(`Z = ${this.criticalValue(u, samples)}`);
      console.log(`Zкрит = ${zCrit}`);
      console.log(`${this.criticalValue(u, samples)} < ${zCrit} ?`);
      return this.criticalValue(u, samples) < zCrit;
    }
  };

  criticalValue = function(u, samples) {
    var uVal = Math.min(u[0], u[1]);
    let m = samples[0].length;
    let n = samples[1].length;
    let s = m + n;

    // // Count the ranks
    var counts = {};
    samples.forEach(function(sample) {
      sample.forEach(function(o) {
        if (!counts[o]) counts[o] = 1;
        else counts[o]++;
      });
    });

    // Find any tied ranks
    var ties = Object.keys(counts)
      .filter(function(key) {
        return counts[key] > 1;
      })
      .map(function(tie) {
        return counts[tie];
      });
    var k = ties.length;

    // Compute correction
    var tSum = 0;
    for (var i = 0; i < k; i++) {
      tSum += Math.pow(ties[i], 3) - ties[i];
    }

    let z =
      Math.abs(uVal - (m * n) / 2) /
      Math.sqrt(
        ((m * n) / (s * (s - 1))) * ((Math.pow(s, 3) - s) / 12) - tSum / 12
      );

    return z;
  };

  render() {
    let { n, m, nMin, nMax, mMin, mMax } = this.state;
    let U = this.test([n, m]);
    console.log(this.check(U, [n, m]));

    return (
      <Fragment>
        <div className="mann-board__names">
          {this.methodCheck(U, [n, m]) ? (
            <div className="mann-notice">
              Гипотеза об однородности выборочных данных подтверждается
            </div>
          ) : (
            <div className="mann-notice">
              Гипотеза об однородности выборочных данных не подтверждается
              <br />
              <div className="subtext">
                уравняйте минимальные и максимальные пороги рандомной генерации
              </div>
            </div>
          )}
        </div>
        <div className="mann-board__body">
          <div className="n-section">
            <h2>N</h2>
            <div className="mann-board__input-wrapper">
              <div className="form-group">
                <p>Min</p>
                <input
                  type="number"
                  onChange={this.handleInputChange}
                  value={nMin}
                  name="nMin"
                />
              </div>
              <div className="form-group">
                <p>Max</p>
                <input
                  type="number"
                  onChange={this.handleInputChange}
                  value={nMax}
                  name="nMax"
                />
              </div>
            </div>
            <span>Выборка N:</span> {n.map(n => `${n} `)}
          </div>
          <div className="m-section">
            <h2>M</h2>
            <div className="mann-board__input-wrapper">
              <div className="form-group">
                <p>Min</p>
                <input
                  type="number"
                  onChange={this.handleInputChange}
                  value={mMin}
                  name="mMin"
                />
              </div>
              <div className="form-group">
                <p>Max</p>
                <input
                  type="number"
                  onChange={this.handleInputChange}
                  value={mMax}
                  name="mMax"
                />
              </div>
            </div>
            <span>Выборка M:</span> {m.map(m => `${m} `)}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default MannWhitney;
