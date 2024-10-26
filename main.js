
document.addEventListener('DOMContentLoaded', () => {
    main();
})



async function main() {

    document.querySelectorAll('div[x-data]').forEach(el => {
        let data = JSON.parse(el.getAttribute('x-data'))
        data.input_listener = new Map();
        data.text_listener = new Map()
        data.html_listener = new Map()

        const data_proxy = new Proxy(data, {
            // get: function(target, prop) {
            //     console.log(`Getting ${prop}`)
            //     return target[prop]
            // },
    
            set: function (target, prop, value) {
                target[prop] = value
                if (data.input_listener.has(prop))
                    data.input_listener.get(prop)(value)
                if (data.text_listener.has(prop))
                    data.text_listener.get(prop)(value)
                if (data.html_listener.has(prop))
                    data.html_listener.get(prop)(value)
            }
        })

        el.querySelectorAll('input').forEach(input => {
            if (input.hasAttribute('x-model')) {
                input.addEventListener('input', () => {
                    data_proxy[input.getAttribute('x-model')] = input.value
                })
    
                data.input_listener.set(input.getAttribute('x-model'), value => {
                    input.value = value
                })
            }
        })
    

        el.querySelectorAll('p[x-text], div[x-text]').forEach(el => {
    
            el.textContent = data_proxy[el.getAttribute('x-text')]
    
            data.text_listener.set(el.getAttribute('x-text'), value => {
                el.textContent = value
            })
        })

        el.querySelectorAll('p[x-html], div[x-html]').forEach(el => {
    
            el.innerHTML = data_proxy[el.getAttribute('x-html')]
    
            data.html_listener.set(el.getAttribute('x-html'), value => {
                el.innerHTML = value
            })
        })

        
    })

    

}
