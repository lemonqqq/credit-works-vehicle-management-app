function TextField({ editMode, textValue, label, onChangeHandler, required }) {
  return (
    <>
      <h5>{`${label} ${required ? "*" : ""}`}</h5>
      {editMode ? (
        <>
          <input
            type="text"
            defaultValue={textValue}
            required={required}
            onChange={onChangeHandler}
          />
        </>
      ) : (
        <>
          <span>{textValue}</span>
        </>
      )}
    </>
  );
}

export default TextField;
