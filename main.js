
document.addEventListener('DOMContentLoaded', () => {
    main();
})



async function main() {

    document.querySelectorAll('[x-data]').forEach(el => {
        let data = JSON.parse(el.getAttribute('x-data'))
        data.input_listener = new Map();
        data.text_listener = new Map()
        data.html_listener = new Map()
        data.checked_listener = new Map()

        const data_proxy = new Proxy(data, {
            // get: function(target, prop) {
            //     console.log(`Getting ${prop}`)
            //     return target[prop]
            // },

            set: function (target, prop, value) {
                // console.log(`Setting ${prop} to ${value}`)
                target[prop] = value
                if (data.input_listener.has(prop))
                    data.input_listener.get(prop).forEach(listener => listener(value))
                if (data.text_listener.has(prop))
                    data.text_listener.get(prop).forEach(listener => listener(value))
                if (data.html_listener.has(prop))
                    data.html_listener.get(prop).forEach(listener => listener(value))
                if (data.checked_listener.has(prop))
                    data.checked_listener.get(prop).forEach(listener => listener(value))
            }
        })

        el.querySelectorAll('[x-model][type="text"], [x-model][type="number"]').forEach(input => {

            const attr = input.getAttribute('x-model')

            input.addEventListener('input', () => {
                data_proxy[attr] = input.value
            })

            if (data.input_listener.has(attr)) {
                data.input_listener.get(attr).push((value) => {
                    input.value = value
                })
            } else {
                data.input_listener.set(attr, [(value) => {
                    input.value = value
                }])
            }
        })

        el.querySelectorAll('[x-model][type="checkbox"]').forEach(checkbox => {
            const attr = checkbox.getAttribute('x-model')

            checkbox.addEventListener('change', () => {
                data_proxy[attr] = checkbox.checked
            })

            if (data.checked_listener.has(attr)) {
                data.checked_listener.get(attr).push((value) => {
                    checkbox.checked = value
                })
            } else {
                data.checked_listener.set(attr, [(value) => {
                    checkbox.checked = value
                }])
            }
        })


        el.querySelectorAll('[x-text]').forEach(el => {
            const attr = el.getAttribute('x-text')

            el.textContent = data_proxy[attr]

            if (!data.text_listener.has(attr)) {
                data.text_listener.set(attr, [(value) => {
                    el.textContent = value
                }])
            } else {
                data.text_listener.get(attr).push((value) => {
                    el.textContent = value
                })
            }
        })

        el.querySelectorAll('[x-html]').forEach(el => {

            const attr = el.getAttribute('x-html')

            el.innerHTML = data_proxy[attr]

            if (!data.html_listener.has(attr)) {
                data.html_listener.set(attr, [(value) => {
                    el.innerHTML = value
                }])
            } else {
                data.html_listener.get(attr).push((value) => {
                    el.innerHTML = value
                })
            }
        })


    })



}
