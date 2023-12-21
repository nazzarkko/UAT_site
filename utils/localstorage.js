export function writeLS(key, value) {
    // Convert the value to a string if it's not already
    // This is necessary because localStorage can only store strings
    const stringValue = JSON.stringify(value);

    // Use localStorage's setItem method to store the key-value pair
    localStorage.setItem(key, stringValue);
}


export function readLS(key) {
    // Use localStorage's getItem method to get the value
    const stringValue = localStorage.getItem(key);

    // If the value exists, convert it back to an object, otherwise return null
    return stringValue ? JSON.parse(stringValue) : null;
}