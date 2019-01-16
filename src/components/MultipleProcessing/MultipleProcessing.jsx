import React, { Fragment } from "react";
import "./MultipleProcessing.scss";

class MultipleProcessing extends React.Component {
  state = {
    randomNumbers: [],
    randNumberCount: "",
    minRandomNumber: 1,
    maxRandomNumber: 100,
    median: 0,
    sampleMean: 0,
    dispersion: 0
  };

  calculate = () => {
    let {
      randomNumbers,
      randNumberCount,
      minRandomNumber,
      maxRandomNumber
    } = this.state;

    if (randNumberCount > 1) {
      for (let i = 0; i < randNumberCount; i++) {
        let n = this.getRndInteger(minRandomNumber, maxRandomNumber);
        randomNumbers = [...randomNumbers, n];
      }

      let median = this.findMedian(randomNumbers);
      let sampleMean = this.findSampleMeanValue(randomNumbers);
      let dispersion = this.findDispersion(randomNumbers);

      this.setState({
        randomNumbers: randomNumbers,
        median: median,
        sampleMean: sampleMean,
        dispersion: dispersion
      });
    }
  };

  getRndInteger = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  findMedian = numArray => {
    this.sortArray(numArray);
    let a = numArray[numArray.length / 2 - 1];
    let b = numArray[numArray.length / 2];
    let median = (a + b) / 2;
    return median;
  };

  findSampleMeanValue = numArray => {
    let sr = numArray.reduce((a, b) => a + b);
    return sr / numArray.length;
  };

  sortArray = array => array.sort((a, b) => a - b);

  findDispersion = numArray => {
    let dispersion = this.state.dispersion;

    for (let i = 0; i < numArray.length; i++) {
      dispersion += (numArray[i] - this.findSampleMeanValue(numArray)) ** 2;
    }

    return (dispersion /= numArray.length - 1);
  };

  handleChangeRndNumbersCount = async e => {
    await this.setState({ randNumberCount: e.target.value });
    await this.resetState();
    await this.calculate();
  };

  resetState = () =>
    this.setState({
      randomNumbers: [],
      median: 0,
      sampleMean: 0,
      dispersion: 0
    });

  handleChangeMinRandomNumber = async e => {
    let number = parseInt(e.target.value);
    if (number > 0) {
      await this.resetState();
      await this.setState({ minRandomNumber: number });
      await this.calculate();
    }
  };

  handleChangeMaxRandomNumber = async e => {
    let number = parseInt(e.target.value);
    if (number > 0) {
      await this.resetState();
      await this.setState({ maxRandomNumber: number });
      await this.calculate();
    }
  };

  render() {
    let {
      randomNumbers,
      sampleMean,
      median,
      dispersion,
      randNumberCount,
      minRandomNumber,
      maxRandomNumber
    } = this.state;
    let SKO = dispersion ** 0.5;
    return (
      <Fragment>
        <div className="board__input-wrapper">
          <div className="form-group">
            <p>Count</p>
            <input
              type="number"
              value={randNumberCount}
              placeholder="Введите количество рандомных чисел"
              onChange={this.handleChangeRndNumbersCount}
            />
          </div>
          <div className="form-group">
            <p>Min</p>
            <input
              type="number"
              value={minRandomNumber}
              placeholder="Введите минимальный порог чисел"
              onChange={this.handleChangeMinRandomNumber}
            />
          </div>
          <div className="form-group">
            <p>Max</p>
            <input
              type="number"
              value={maxRandomNumber}
              placeholder="Введите максимальный порог чисел"
              onChange={this.handleChangeMaxRandomNumber}
            />
          </div>
        </div>
        <div className="board__outputs">
          {randomNumbers.length > 0 ? (
            <Fragment>
              <br />
              <span> Ряд чисел:</span>{" "}
              {randomNumbers.map(number => `${number} `)}
              <br />
              <span> Медиана:</span> {median}
              <br />
              <span> Среднее выборочное:</span> {sampleMean}
              <br />
              <span> Дисперсия: </span>
              {dispersion}
              <br />
              <span> CKO: </span>
              {SKO}
            </Fragment>
          ) : (
            <div className="notice">Укажите количество чисел > 1</div>
          )}
        </div>
      </Fragment>
    );
  }
}

export default MultipleProcessing;
