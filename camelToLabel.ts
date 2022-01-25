const ctlRe = /(?=[A-Z])/;
export function camelToLabel(s: string) {
    let label = s.split(ctlRe).join(' ');
    return label[0].toUpperCase() + label.substring(1);
}