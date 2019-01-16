import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Menu.scss";

export default class Menu extends Component {
  render() {
    return (
      <div className="menu">
        <Link to="/multiple_processing">
          <div className="menu__item">
            <h3 className="item__title">Обработка рандомных чисел</h3>
            <p className="item__description">
              Нахождение медианы, среднего выборочного, дисперсии и СКО
            </p>
          </div>
        </Link>
        <Link to="/mann-whitney">
          <div className="menu__item">
            <h3 className="item__title">U-критерий Манна - Уитни</h3>
            <p className="item__description">
              Нахождение U-критерия Манна - Уитни и подтверждение гипотезы
              однородности данных
            </p>
          </div>
        </Link>
      </div>
    );
  }
}
