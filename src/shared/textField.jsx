function TextField({
    editMode,
    textValue,
    label,
    onChangeHandler
}) {

    return (<>
        <h5>{label}</h5>
        {editMode 
        ? <>
            <input type="text" value={textValue}
                onChange={onChangeHandler}
            />
        </>
        : <>
            <span>{textValue}</span>
        </>}
    </>);
}

export default TextField;