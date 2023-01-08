async function stuff() {
    const validRanges = [];
    const invalidRanges = [];
    let year, min, max;

    while (true) {
        year = await ask('year?');
        if(isNaN(year)) break;
        min = await ask('min?');
        max = await ask('max?');
				console.time();
        validRanges.push([year - max, year + max]);
        invalidRanges.push([year - min, year + min]);
        calculate(validRanges, invalidRanges);
				console.timeEnd();
    }
}

function calculate(val, inval) {
    let y = -10000;
    const calculated = [[]];
    while (y++ < 2100) {
        const yearIsGood = !inval.some(([i, x]) => y > i && y < x) && val.every(([i, x]) => y >= i && y <= x);
        if (!yearIsGood) continue;
        const r = calculated[calculated.length - 1];
        if (!r[0]) {
            r[0] = [y, y];
        } else if(r[0][1] === y - 1) {
            r[0][1] = y;
        } else {
            calculated.push([[y, y]]);
        }
    };
    alert(JSON.stringify(calculated));
}


function ask(q) {
    return new Promise(r => {
        const a = prompt(q);
        r(+a);
    });
}

document.querySelector('#y-btn').addEventListener('click', () => {
    stuff();
})