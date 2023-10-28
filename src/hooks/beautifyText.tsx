function beautifyText(ugly: string | undefined | null) {
    if (ugly == null || ugly == undefined) {
        return "";
    } else {
        return ugly.split("_").map(word => word[0].toLocaleUpperCase() + word.substring(1, word.length).toLocaleLowerCase()).join(" ");
    }
}

export default beautifyText;