import { camelCase } from '../strings'

export const STYLES = {
  Const: {
    upper: ['default']
  },
  Param: {
    camel: ['csharp']
  },
  // name acts as default
  Name: {
    camel: ['javascript', 'java'],
    pascal: ['csharp']
  }
}

export function replaceDocNames (language, content) {

  return content.replace(/`?@@doc(Name|Method|Const|Prop|Class|Param): ?([a-zA-Z0-9?_]*)`?/g, function (shell, type, value) {
    return wrap(shell, type, () => {
      const style = findStyle(type, language);

      switch (style) {
        case 'upper':
          return value.toUpperCase();

        case 'camel':
          return camelCase(value);

        case 'pascal':
          return camelCase(value, true);

        default:
          return value;
      }
    })
  })
}

function findStyle(type, language) {
  let style = Object.keys(STYLES[type] || []).find(style => {
    let _style = STYLES[type][style];
    return _style ? _style.indexOf(language) >= 0 : false;
  })

  // try to find a default style for the type
  if (!style && language !== 'default') {
    style = findStyle(type, 'default');
  }

  // default to name if no specific style is set
  if (!style && type !== 'Name') {
    style = findStyle('Name', language);
  }

  return style;
}

function wrap (shell, type, value) {
  value = value();
  if (shell.indexOf('`') === 0) {
    return shell.replace(/@@docName: ?([a-zA-Z0-9?_]*)/, value);
  }
  else {
    return `<dfn class="doc-name doc-name--${type.toLowerCase()}">${value}</dfn>`;
  }
}