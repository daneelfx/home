'use strict'

const colors = [
  'rgba(255,215,0,1)',
  'rgba(139,0,0,1)',
  'rgba(0,128,128,1)',
  'rgba(255,140,0,1)',
  'rgba(210,105,30,1)',
  'rgba(255,0,255,1)',
  'rgba(65,105,225,1)',
  'rgba(124,252,0,1)',
]

let lanternSelected = 1
let areBothActive = false

const colorHandler = function () {
  document.querySelector(`.main__light--${lanternSelected}`).style.backgroundColor = `${this.style.backgroundColor}`
  document.querySelector(
    `.main__lantern--${lanternSelected}`
  ).style.boxShadow = `0px 2px 6px 6px ${this.style.backgroundColor}`

  if (areBothActive) lanternSelected = lanternSelected === 1 ? 2 : 1
}

const colorElementsArray = Array.from(document.querySelectorAll('.color__container div'), el => el)

colorElementsArray.forEach((colorElement, idx) => {
  colorElement.style.backgroundColor = colors[idx]
  colorElement.addEventListener('click', colorHandler)
})

document.querySelector('.light-button--1').addEventListener('click', function () {
  document.querySelector('.main__lantern--1').classList.remove('main__lantern--1--moved')
  document.querySelector('.main__light--1').classList.remove('main__light--1--moved')
  document.querySelector('.main__lantern--2').style.opacity = 0
  document.querySelector('.main__light--2').style.opacity = 0
  areBothActive = !areBothActive
})

document.querySelector('.light-button--2').addEventListener('click', function () {
  document.querySelector('.main__lantern--1').classList.add('main__lantern--1--moved')
  document.querySelector('.main__light--1').classList.add('main__light--1--moved')
  document.querySelector('.main__lantern--2').style.opacity = 1
  document.querySelector('.main__light--2').style.opacity = 0.6
  areBothActive = !areBothActive
})
