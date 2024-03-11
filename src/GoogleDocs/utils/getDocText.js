function getDocText() {
    function le(e, t, n, o = Object.getOwnPropertyNames(e)) {
        const r = new Set
            , i = [];
        let s = 0;
        const a = (o, l, c, u = 0) => {
            if (s++,
                "prototype" === o || l instanceof Window)
                return;
            if (u > n)
                return;
            const d = [...c, o];
            try {
                if (t(o, l))
                    return void i.push({
                        path: d,
                        value: l
                    })
            } catch (e) { }
            var g;
            if (null != l && !r.has(l))
                if (r.add(l),
                    Array.isArray(l))
                    l.forEach(((e, t) => {
                        try {
                            a(t.toString(), e, d, u + 1)
                        } catch (e) { }
                    }
                    ));
                else if (l instanceof Object) {
                    ((g = l) && null !== g && 1 === g.nodeType && "string" == typeof g.nodeName ? Object.getOwnPropertyNames(e).filter((e => !J.has(e))) : Object.getOwnPropertyNames(l)).forEach((e => {
                        try {
                            a(e, l[e], d, u + 1)
                        } catch (e) { }
                    }
                    ))
                }
        }
            ;
        return o.forEach((t => {
            try {
                a(t, e[t], [])
            } catch (e) { }
        }
        )),
        {
            results: i,
            iterations: s
        }
    }
    return le(window.KX_kixApp, ((e, t) => t && "\x03" === t.toString().charAt(0)), 5).results[0].value
}
module.exports = getDocText;