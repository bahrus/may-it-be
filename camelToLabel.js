const ctlRe = /(?=[A-Z])/;
export function camelToLabel(s) {
    let label = s.split(ctlRe).join(' ');
    return label[0].toUpperCase() + label.substring(1);
}
