function allChildren(element){
    let children = [];
    for (let i = 0; i < element.children.length; i++) {
        children.push(element.children[i]);
        children = children.concat(allChildren(element.children[i]));
    }
    return children;
}
module.exports = allChildren;