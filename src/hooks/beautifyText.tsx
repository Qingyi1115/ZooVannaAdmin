function beautifyText(ugly: string | undefined | null) {
    if (ugly === null || ugly === undefined || ugly.length == 0) {
        return "";
    } else {
        return ugly.split("_").map(word => word[0].toLocaleUpperCase() + word.substring(1, word.length).toLocaleLowerCase()).join(" ");
    }
}

export default beautifyText;