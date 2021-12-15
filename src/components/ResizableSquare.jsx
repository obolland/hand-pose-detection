import React from "react";

const ResizableSquare = React.forwardRef((_, ref) => {
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        backgroundColor: "blue",
      }}
    />
  );
});

export default ResizableSquare;
