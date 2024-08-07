import React, { useState, useEffect } from "react";
import DataGrid from "./DataGrid";
import CsvFileUploader from "./Upload";
import ChartComponent from "./ChartComponent";
import "./App.css";


export default function App() {
  const [csv, setCsv] = useState(null);
  const [selectedHeaders, setSelectedHeaders] = useState([]);
  const [headerSearch, setHeaderSearch] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [filterHeader1, setFilterHeader1] = useState("");
  const [filterValue1, setFilterValue1] = useState("");
  const [filterHeader2, setFilterHeader2] = useState("");
  const [filterValue2, setFilterValue2] = useState("");
  const [filterHeader3, setFilterHeader3] = useState("");
  const [filterValue3, setFilterValue3] = useState("");
  const [chartData, setChartData] = useState(null);
  const [availableValues1, setAvailableValues1] = useState([]);
  const [availableValues2, setAvailableValues2] = useState([]);
  const [availableValues3, setAvailableValues3] = useState([]);
  const [filteredData, setFilteredData] = useState(null);

  const handleFileUpload = (data) => {
    const headers = Object.keys(data[0]);
    setCsv({
      headers,
      data: data.map((row) => headers.map((header) => row[header])),
    });
    setSelectedHeaders(headers); // Inicialmente seleciona todos os headers
  };

  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `hsl(${(i * 360) / count}, 70%, 50%)`;
      colors.push(color);
    }
    return colors;
  };

  const handleGenerateChart = () => {
    if (!filterHeader1 && !filterHeader2 && !filterHeader3) {
      alert("Selecione pelo menos um filtro");
      return;
    }

    const dataToFilter = filteredData?.data || [];

    let labels = [];
    let datasetData = [];

    // Coleta todas as combinações de filtros
    const filterCombinations = dataToFilter.map((row) => {
      const combination = [];
      if (filterHeader1)
        combination.push(row[csv.headers.indexOf(filterHeader1)]);
      if (filterHeader2)
        combination.push(row[csv.headers.indexOf(filterHeader2)]);
      if (filterHeader3)
        combination.push(row[csv.headers.indexOf(filterHeader3)]);
      return combination.join(" - ");
    });

    // Obtem labels únicas e conta ocorrências
    labels = [...new Set(filterCombinations)];
    datasetData = labels.map(
      (label) => filterCombinations.filter((combo) => combo === label).length
    );

    const colors = generateColors(labels.length);

    setChartData({
      labels,
      datasets: [
        {
          label: `Distribuição por Filtros`,
          data: datasetData,
          backgroundColor: colors,
          borderColor: colors.map((color) => color.replace("70%", "50%")),
          borderWidth: 1,
        },
      ],
    });

    // Limpa os filtros após gerar o gráfico
    setFilterHeader1("");
    setFilterValue1("");
    setFilterHeader2("");
    setFilterValue2("");
    setFilterHeader3("");
    setFilterValue3("");
  };

  useEffect(() => {
    if (csv && filterHeader1) {
      const values = [
        ...new Set(
          csv.data.map((row) => row[csv.headers.indexOf(filterHeader1)])
        ),
      ];
      setAvailableValues1(values);
    }
  }, [filterHeader1, csv]);

  useEffect(() => {
    if (csv && filterHeader2) {
      const values = [
        ...new Set(
          csv.data.map((row) => row[csv.headers.indexOf(filterHeader2)])
        ),
      ];
      setAvailableValues2(values);
    }
  }, [filterHeader2, csv]);

  useEffect(() => {
    if (csv && filterHeader3) {
      const index3 = csv.headers.indexOf(filterHeader3);
      const values = [
        ...new Set(
          csv.data.map((row) => row[index3])
        ),
      ];
      setAvailableValues3(values);
    } else {
      setAvailableValues3([]);
    }
  }, [filterHeader3, csv]);

  useEffect(() => {
    if (csv) {
      let data = csv.data;

      if (filterHeader1 && filterValue1) {
        data = data.filter(
          (row) => row[csv.headers.indexOf(filterHeader1)] === filterValue1
        );
      }

      if (filterHeader2 && filterValue2) {
        data = data.filter(
          (row) => row[csv.headers.indexOf(filterHeader2)] === filterValue2
        );
      }

      if (filterHeader3 && filterValue3) {
        data = data.filter(
          (row) =>
            row[csv.headers.indexOf(filterHeader3)]
              .toString()
              .toLowerCase()
              .includes(filterValue3.toLowerCase())
        );
      }

      setFilteredData({
        headers: csv.headers,
        data,
      });
    }
  }, [csv, filterHeader1, filterValue1, filterHeader2, filterValue2, filterHeader3, filterValue3]);

  const filteredHeaders = csv
    ? csv.headers.filter((header) =>
        header.toLowerCase().includes(headerSearch.toLowerCase())
      )
    : [];

  return (
    <div className="App">
      <CsvFileUploader onFileUpload={handleFileUpload} />
      {csv && (
        <>
          <div className="header-selector">
            <h3>Selecione os Headers:</h3>
            <input
              type="text"
              className="filter-input"
              placeholder="Pesquisar headers"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
            />
            <div className="header-list">
              {filteredHeaders.map((header) => (
                <div key={header} className="header-item">
                  <input
                    type="checkbox"
                    checked={selectedHeaders.includes(header)}
                    onChange={() => {
                      if (selectedHeaders.includes(header)) {
                        setSelectedHeaders(
                          selectedHeaders.filter((h) => h !== header)
                        );
                      } else {
                        setSelectedHeaders([...selectedHeaders, header]);
                      }
                    }}
                  />
                  {header}
                </div>
              ))}
            </div>
          </div>
          <div className="filter-selector">
            <h3>Filtros:</h3>
            <div className="filter-item">
              <label>Header 1:</label>
              <select
                value={filterHeader1}
                onChange={(e) => setFilterHeader1(e.target.value)}
              >
                <option value="">Selecione</option>
                {csv.headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
              <label>Valor 1:</label>
              <select
                value={filterValue1}
                onChange={(e) => setFilterValue1(e.target.value)}
              >
                <option value="">Selecione</option>
                {availableValues1.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-item">
              <label>Header 2:</label>
              <select
                value={filterHeader2}
                onChange={(e) => setFilterHeader2(e.target.value)}
              >
                <option value="">Selecione</option>
                {csv.headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
              <label>Valor 2:</label>
              <select
                value={filterValue2}
                onChange={(e) => setFilterValue2(e.target.value)}
              >
                <option value="">Selecione</option>
                {availableValues2.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-item">
              <label>Header 3:</label>
              <select value={filterHeader3} onChange={(e) => setFilterHeader3(e.target.value)}>
                <option value="">Selecione</option>
                {csv.headers.map((header) => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
              <label>Valor 3:</label>
              <input
                type="text"
                placeholder="Ensira um valor"
                value={filterValue3}
                onChange={(e) => setFilterValue3(e.target.value)}
              />              
            </div>
          </div>
          <div className="chart-selector">
            <h3>Tipo de Gráfico:</h3>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="bar">Barra</option>
              <option value="pie">Pizza</option>
            </select>
            <button onClick={handleGenerateChart}>Gerar</button>
          </div>
          <DataGrid csv={filteredData} selectedHeaders={selectedHeaders} />
          {chartData && (
            <ChartComponent chartData={chartData} chartType={chartType} />
          )}
        </>
      )}
    </div>
  );
}

