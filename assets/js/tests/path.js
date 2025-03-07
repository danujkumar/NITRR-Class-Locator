//This is automated test for paths in the engine
let j = 205;
let i = 205;
import { testUnitStart, testUnitEnd } from "../G-Map.js";

export const testPath = () => {
  console.log(j);
  testUnitStart(i);
    const paths = setInterval(() => {
        j++;
        if(j > 303) {
          clearInterval(paths);
        }
        testUnitEnd(j);
    }, 1000);
  // while(j<=321) {
  //     setTimeout(function() {

  //     }, 1000);
  // }
};
