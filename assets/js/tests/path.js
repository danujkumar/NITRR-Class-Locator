//This is automated test for paths in the engine
let j = 302;
let i = 320;
import { testUnitStart, testUnitEnd } from "../G-Map.js";

export const testPath = () => {
  console.log(j);
  testUnitStart(i);
    const paths = setInterval(() => {
        j++;
        testUnitEnd(j);
        if(j > 321) {
          clearInterval(paths);
        }
    }, 2000);
  // while(j<=321) {
  //     setTimeout(function() {

  //     }, 1000);
  // }
};
