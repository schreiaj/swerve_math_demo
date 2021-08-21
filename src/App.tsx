import React, { useEffect } from 'react';
import './App.css';
import { Mafs, CartesianCoordinates, useMovablePoint, Vector, Circle, Point, useStopwatch } from "mafs"
import * as vec from "vec-la"
import { clamp } from "lodash"


function App() {


  const { time:t , start } = useStopwatch()
  const timeScale = .25

  useEffect(() => start(), [start])

  const trackWidth = 2
  const trackLength = 2
  const translationLeftStick = vec
    .matrixBuilder()
    .translate(-2, -2)
    .get()

  const leftStick = useMovablePoint([0, 0], { color: "blue", transform: translationLeftStick, constrain: ([x, y]) => [clamp(x, -1, 1), clamp(y, -1, 1)] })

  const translationRightStick = vec
    .matrixBuilder()
    .translate(2, -2)
    .get()

  const rightStick = useMovablePoint([0, 0], { color: "red", transform: translationRightStick, constrain: ([x, y]) => [clamp(x, -1, 1), clamp(y, 0, 0)] })
  const x = leftStick.x
  const y = leftStick.y
  // const x = Math.cos(t*timeScale * 2 * Math.PI)
  // const y = Math.sin(t*timeScale * 2 * Math.PI)
  // const theta = Math.PI / 2 - Math.atan2(rightStick.x, rightStick.y)
  const theta = rightStick.x

  const wheels = [
    [trackWidth / 2, trackLength / 2],
    [-trackWidth / 2, trackLength / 2],
    [-trackWidth / 2, -trackLength / 2],
    [trackWidth / 2, -trackLength / 2]
  ]

  let max_v = -Infinity
  let wheel_states = wheels.map(w => {
    let w_x = x + theta * w[1] / trackWidth
    let w_y = y - theta * w[0] / trackLength
    let v = Math.sqrt(Math.pow(w_x, 2) + Math.pow(w_y, 2))
    let angle = -Math.atan2(w_x, w_y)
    max_v = v > max_v ? v : max_v
    return { v, angle }
  });

  const wheel_v = wheel_states.map((v, i) => {
    return vec.add(wheels[i], vec.rotate([0, v.v / Math.max(max_v, 1)], v.angle))
  })


  return (
    <Mafs xAxisExtent={[-5, 5]} yAxisExtent={[-5, 5]}>
      <CartesianCoordinates />

      {wheels.map((v, i) => {

        return <React.Fragment>
          <Vector tail={v} tip={wheel_v[i]} />

        </React.Fragment>
      })}

      <Point x={-2} y={-2} color="white" />
      <Point x={2} y={-2} color="white" />
      <Point x={x-2} y={y-2} color="blue" />
      {leftStick.element}
      {rightStick.element}
    </Mafs>
  );
}

export default App;
