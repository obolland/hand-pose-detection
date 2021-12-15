import React from "react";

const ResizableSquare = React.forwardRef((_, boxRef) => {
  return (
    <div
      ref={boxRef}
      style={{
        display: "flex",
        backgroundColor: "blue",
      }}
    />
  );
});

export default ResizableSquare;
