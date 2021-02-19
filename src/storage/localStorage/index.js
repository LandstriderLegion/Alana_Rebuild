export default class LocalStorageStrategy {
    create(key, value) {
        // Document check required for react-static
        if (typeof window !== 'undefined') {

            localStorage.setItem(key, JSON.stringify(value))
        }
    }

    read(key) {
        // Document check required for react-static
        if (typeof window !== 'undefined') {

            return JSON.parse(localStorage.getItem(key))
        } else {
            return undefined
        }
    }

    update(key, value) {
        // Document check required for react-static
        if (typeof window !== 'undefined') {

            localStorage.setItem(key, JSON.stringify(value))
        }
    }

    remove(key) {
        // Document check required for react-static
        if (typeof window !== 'undefined') {

            localStorage.removeItem(key)
        }
    }
}