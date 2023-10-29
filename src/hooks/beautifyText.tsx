function beautifyText(ugly: string | undefined | null) { 
    if (typeof ugly !== 'string' || ugly.length == 0) {
        return String(ugly);
    } else {
        return ugly.split("_").map(word => word[0].toLocaleUpperCase() + word.substring(1, word.length).toLocaleLowerCase()).join(" ");
    }
}

export default beautifyText;