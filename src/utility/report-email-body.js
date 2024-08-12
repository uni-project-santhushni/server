export const GetReportEmailBody = async (checkups, vaccines) => {
  if (!checkups || !vaccines) {
    return new Error("checkup or and vaccination data not define");
  }

  const html = `
    
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Report</title>
    <style>
      * {
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        width: 100%;
        max-width: 550px;
        margin: 0 auto;
        background-color: #f9f9f9;
        /* padding: 20px; */
        box-sizing: border-box;
        overflow: hidden;
      }
      .title {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        h2,
        h5 {
          margin: 0;
        }

        h2 {
          font-size: 2rem;
          color: #049930;
          padding: 10px 0;
        }

        h5 {
          font-size: 1rem;
          color: #666;
          padding-bottom: 10px;
        }
      }

      .vaccine{
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        overflow-x: auto;
      }

      #vaccine-table {
        width: 100%;
        border-collapse: collapse;
        max-height: 300px;
        overflow: auto;
      }
      #vaccine-table thead tr th {
        padding: 12px 10px;
        background-color: #2e2e2e;
        color: white;
        text-align: left;
        border: 1px solid #e0e0e0;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        word-wrap: none;
        white-space: nowrap;
      }
      #vaccine-table thead tr .actions {
        text-align: center;
      }
      #vaccine-table tbody tr td {
        padding: 10px;
        border: 1px solid #e0e0e0;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
      }
      #vaccine-table tbody tr .not-active {
        color: #da4b4b;
      }
      #vaccine-table tbody tr .active {
        color: #4bda4b;
        background-color: #fff;
      }
      #vaccine-table tbody tr .action-col span {
        width: 100%;
        display: flex;
        justify-content: center;
      }
      #vaccine-table tbody tr .action-col span button {
        padding: 3px 10px;
        margin-left: 5px;
        width: 60px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 12px;
        border: none;
        background-color: #d84b4b;
        color: white;
        padding: 5px 10px;
        cursor: pointer;
      }
      #vaccine-table tbody tr .action-col span button:hover {
        background-color: rgba(230, 26, 26, 0.8);
      }
      #vaccine-table tbody tr .action-col span button:active {
        background-color: #8a48f5;
      }

      .checkups{
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="title">
        <h2>Daily Report</h2>
        <h5>2023-01-01</h5>
      </div>

      <div class="vaccine">
        <h3>Vaccines</h3>
        <table id="vaccine-table">
          <thead>
            <tr>
              <th>Cattle ID</th>
              <th>Vaccine ID</th>
              <th>Vaccine Name</th>
              <th>Given Age (Dates)</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
          ${vaccines.map(vaccine => `
            <tr>
              <td>${vaccine.cattle_id}</td>
              <td>${vaccine.vaccine_id}</td>
              <td>${vaccine.vaccine_name}</td>
              <td>${vaccine.given_age}</td>
              <td>${vaccine.description}</td>
            </tr>
          `).join('')}
          </tbody>
        </table>
      </div>

      <div class="checkups">
        <h3>Checkups</h3>
        <table id="vaccine-table">
        
            <thead>
              <tr>
                <th>Checkup ID</th>
                <th>Cattle ID</th>
                <th>General Health</th>
                <th>Body Condition Score (BCS)</th>
                <th>Temperature</th>
                <th>Respiratory Rate</th>
              </tr>
            </thead>
      
            <tbody>
            ${checkups.map(checkup => `
                <tr>
                  <td>${checkup.checkup_id}</td>
                  <td>${checkup.cattle_id}</td>
                  <td>${checkup.general_health}</td>
                  <td>${checkup.bcs}</td>
                  <td>${checkup.temperature}</td>
                  <td>${checkup.respiratory_rate}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
      </div>


      
    </div>
  </body>
</html>

    
    `;

    return html;
};
