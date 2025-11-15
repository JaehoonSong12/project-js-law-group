// event-driven programming
import * as Util from '../core-module.js';

export default function main() {
    Util.setupWindowFocusRefresh();
    Util.clickToCenter('cb009', 'cb005');
    Util.enableButtonRedirect('btn-redirect');
    // Util.addNavigationFunctionality1();

    // console.log(5 == "5");   // true (type coercion occurs: "5" becomes 5)
    // console.log(5 === "5");  // false (types are different: number vs string)

    // console.log(0 == false); // true (type coercion occurs: false becomes 0)
    // console.log(0 === false); // false (types are different: number vs boolean)

    // console.log(null == undefined); // true (special case for null and undefined)
    // console.log(null === undefined); // false (types are different)
}