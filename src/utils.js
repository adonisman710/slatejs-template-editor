import { evaluate } from "mathjs";
import Handlebars from "handlebars";

export function runStringExpresion(exp, data) {
  var template = Handlebars.compile(exp);
  return template(data);
}

export function runNumberExpresion(exp, data) {
  const expression = runStringExpresion(exp, data);
  return evaluate(expression, { data });
}

// export function runNumberExpresion (exp, scope) {
//   // convert {{}} to object lookups
//   var template = Handlebars.compile(exp);
//   var handlebarsScope = {};
//   Object.keys(scope).forEach(prop => {
//     handlebarsScope[prop] = `data.${prop}`;
//   });
//   var expression = template(handlebarsScope);
//
//   // run expression
//   return evaluate(expression, { data: scope });
// }
