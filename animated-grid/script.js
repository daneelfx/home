'use strict'

const gridElement = document.querySelector('.grid')
const gridBackgroundElement = document.querySelector('.grid-background')

const gridInitColor = 'rgba(25, 25, 112, 1)'

gridBackgroundElement.style.backgroundColor = gridInitColor

const gridStyles = getComputedStyle(gridElement)

const itemHeightPx = 40
const itemWidthPx = 40

const getGridDimensions = function (itemHeightPx, itemWidthPx) {
  const gridHeight = gridStyles.height.slice(0, -2)
  const gridWidth = gridStyles.width.slice(0, -2)
  const numRows = Math.floor(gridHeight / itemHeightPx)
  const numColumns = Math.floor(gridWidth / itemWidthPx)

  return { numRows, numColumns }
}

const { numRows, numColumns } = getGridDimensions(itemHeightPx, itemWidthPx)

const getRandomNumber = function (min, max) {
  return Math.trunc(Math.random() * (max - min) + min)
}

const preventOutlier = function (number, min, max) {
  if (number < min) return min
  if (number > max) return max

  return number
}

const getRandom3Array = function (min, max) {
  const redComponent = getRandomNumber(min, max)
  const greenComponent = getRandomNumber(min, max)
  const blueComponent = getRandomNumber(min, max)

  return [redComponent, greenComponent, blueComponent]
}

const getShiftedColorComponents = function (baseRed, baseGreen, baseBlue, deltaRed, deltaGreen, deltaBlue) {
  const shiftedRed = preventOutlier(baseRed + deltaRed, 0, 255)
  const shiftedGreen = preventOutlier(baseGreen + deltaGreen, 0, 255)
  const shiftedBlue = preventOutlier(baseBlue + deltaBlue, 0, 255)

  return [shiftedRed, shiftedGreen, shiftedBlue]
}

const setOnClickBackgroundColor = function () {
  let [redComponent, greenComponent, blueComponent] = [25, 25, 112]

  gridElement.addEventListener('click', function () {
    // const [redComponent, greenComponent, blueComponent] = getRandom3Array(0, 255)
    const [deltaRed, deltaGreen, deltaBlue] = getRandom3Array(-20, 20)
    ;[redComponent, greenComponent, blueComponent] = getShiftedColorComponents(
      redComponent,
      greenComponent,
      redComponent,
      deltaRed,
      deltaGreen,
      deltaBlue
    )
    gridBackgroundElement.style.transition = 'all'
    gridBackgroundElement.style.transitionDuration = '0.5s'

    gridBackgroundElement.style.backgroundColor = `rgba(${redComponent}, ${greenComponent}, ${blueComponent}, 1)`
  })
}

setOnClickBackgroundColor()

const setTimeToBeginAppDis = function (element, type, timeInMs) {
  setTimeout(() => {
    type === 'appear' ? (element.style.opacity = 1) : (element.style.opacity = 0)
  }, timeInMs)
}

const mouseOverHandler = function () {
  let [redComponent, greenComponent, blueComponent] = getRandom3Array(0, 255)

  return function (visibleTimeInMs) {
    const [deltaRed, deltaGreen, deltaBlue] = getRandom3Array(-30, 30)

    ;[redComponent, greenComponent, blueComponent] = getShiftedColorComponents(
      redComponent,
      greenComponent,
      redComponent,
      deltaRed,
      deltaGreen,
      deltaBlue
    )

    const color = `rgba(${redComponent}, ${greenComponent}, ${blueComponent}, 1)`

    this.style.backgroundColor = color
    this.style.opacity = 1

    setTimeToBeginAppDis(this, 'appear', visibleTimeInMs)
  }
}

const buildBooleanGrid = function (numRows, numColumns) {
  const rowArray = new Array(numColumns)
  rowArray.fill(false)
  const booleanGrid = new Array(numRows)
  booleanGrid.fill(rowArray)

  return booleanGrid
}

const setInitGrid = function () {
  gridElement.style.gridTemplateRows = `repeat(auto-fill, ${itemHeightPx}px)`
  gridElement.style.gridTemplateColumns = `repeat(auto-fill, ${itemWidthPx}px)`

  const booleanGrid = buildBooleanGrid(numRows, numColumns)

  const handler = mouseOverHandler()

  booleanGrid.forEach(function (rowArray, rowNumber) {
    rowArray.forEach(function (content, columnNumber) {
      let gridItem = document.createElement('div')
      gridItem.classList.add('grid-item', `grid-item__row-${rowNumber}`, `grid-item__column-${columnNumber}`)

      gridItem.addEventListener('mouseover', handler.bind(gridItem, 2000), null, true)
      gridItem.addEventListener('touchmove', handler.bind(gridItem, 2000), null, true)

      gridItem.style.transition = 'all'

      // time to appear/disappear
      gridItem.style.transitionDuration = '2s'

      gridElement.appendChild(gridItem)
    })
  })
}

setInitGrid()

const applyStylesToItem = function (element, styleObject) {
  for (const [styleName, styleValue] of Object.entries(styleObject)) element.style[styleName] = styleValue
}

const colorLine = function (lineType, lineNumber, from, to, timeToAppearBetweenItems = 0, styleObject) {
  const elements = document.querySelectorAll(`.grid-item__${lineType}-${lineNumber}`)
  // console.log('elements length', elements)
  elements.forEach(function (lineElement, position, arr) {
    if (position >= from && position <= to) {
      lineElement.style.opacity = 0
      lineElement.style.transitionDuration = '0s'
      const delay = position * timeToAppearBetweenItems
      setTimeToBeginAppDis(lineElement, 'appear', delay)
      const time = (arr.length - 1) * timeToAppearBetweenItems + 1000
      setTimeToBeginAppDis(lineElement, 'disappear', time)
      setTimeout(function () {
        lineElement.style.transitionDuration = '2s'
      }, time + 1000)
      applyStylesToItem(lineElement, styleObject)
    }
  })
}

// for (let i = 0; i < numColumns; i++) {
//   setTimeout(function () {
//     colorLine('column', i, 0, numColumns - 1, 100, { backgroundColor: 'red' })
//   }, i * 100 + 100)
// }

const colorEntireRow = function (rowNumber, styleObject) {
  colorLine('row', rowNumber, 0, numColumns - 1, 0, styleObject)
}

const colorEntireColumn = function (columnNumber, styleObject) {
  colorLine('column', columnNumber, 0, numRows - 1, 0, styleObject)
}

const removeEventListeners = function () {
  gridElement.childNodes.forEach(function (gridItem) {
    gridItem.style.backgroundColor = 'rgba(0, 0, 0, 0)'
    const newGridItem = gridItem.cloneNode(true)
    gridItem.parentNode.replaceChild(newGridItem, gridItem)
  })
}

const finalAnimation = function () {
  gridBackgroundElement.style.backgroundColor = 'rgba(0, 0, 0, 1)'
  removeEventListeners()

  for (let times = 0; times < (numRows * numColumns) / 2; times++) {
    const randomColumn = getRandomNumber(0, numColumns)
    const randomRow = getRandomNumber(0, numRows)
    const item = document.querySelector(`.grid-item__row-${randomRow}.grid-item__column-${randomColumn}`)
    item.style.transition = 'all'
    item.style.transitionDuration = `${getRandomNumber(0, 500) / 100}s`
    item.style.backgroundColor = 'rgba(127,255,212, 1)'
  }

  setTimeout(() => {
    gridElement.style.opacity = 0
    gridBackgroundElement.style.opacity = 0
  }, 5000)
}

// setTimeout(finalAnimation, 10000)
