import { useState } from "react";

const MultiplicationMatrix: React.FC = () => {
  const [rows, setRows] = useState<number>(0);
  const [columns, setColumns] = useState<number>(0);
  const [matrix, setMatrix] = useState<number[][]>([]);

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRows(parseInt(e.target.value));
  };

  const handleColumnsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColumns(parseInt(e.target.value));
  };

  const generateMatrix = () => {
    const newMatrix: number[][] = [];
    for (let i = 1; i <= rows; i++) {
      const row: number[] = [];
      for (let j = 1; j <= columns; j++) {
        row.push(i * j);
      }
      newMatrix.push(row);
    }
    setMatrix(newMatrix);
  };

  return (
    <>
      <div>
        <label>
          Rows:
          <input type="number" value={rows} onChange={handleRowsChange} />
        </label>
      </div>
      <div>
        <label>
          Columns:
          <input type="number" value={columns} onChange={handleColumnsChange} />
        </label>
      </div>
      <button onClick={generateMatrix}>Generate Matrix</button>
      {matrix.length > 0 && (
        <table>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default MultiplicationMatrix;
