const puppeteer = require("puppeteer");
const fs = require("fs");

async function generatePDF(req, res) {
  const requestBody = req.query;
  try {
    const browser = await puppeteer.launch({
      headless: "new",
    });
    console.log(requestBody);
    const page = await browser.newPage();
    const weeks = getWeeksBetweenDates(
      requestBody.startDate,
      requestBody.endDate
    );
    const html = `
       <style>
    @import url('https://fonts.googleapis.com/css2?family=Glegoo&display=swap');

    .container {
        font-family: 'Glegoo', serif;
        max-width: 21cm;
        margin: 0 auto;
    }

    .header-main {
        display: flex;
        flex-direction: column;
        line-height: 0.5rem;
        align-items: end;
    }

    .header-s {
        display: flex;
        flex-direction: column;

        margin-top: 0px;
    }

    .b-header {
        margin: 0px;
        font-size: 13px !important;
        font-weight: bold;
    }

    .header {
        font-size: 11px !important;
        margin-left: 0px;
        font-weight: bold;
    }

    .c-inner-container {
        display: flex;
        margin-top: 12px;
        gap: 30px;

        line-height: 1.2rem;
        font-size: 11px !important;
    }

    .section1 {
        width: 100%;
    }

    .sub-header {
        font-weight: bold;
        font-size: 11px;
        margin: 5px 0;
    }

    .section2 {
        width: 100%;
    }

    .content {
        padding: 0px;
        margin: 0px;
    }

    .header-content {
        padding: 0px;
        margin: 0px;
    }

    .sign-content {
        columns: 5;
        border-top: 0px;
        margin-left: 12px;
        padding: 0px;
        padding-top: 12px;
        font-size: 11px;
        width: 100%;

        /* col-5 border-top mx-4 p-0 py-3 text-sm */
    }

    .signature {
        display: flex;
        margin: 5rem 0;
        gap: 5rem
    }

    .signature>.row {
        border-top: 1px solid grey;
        width: 320px;
    }

    .date-content {
        margin-top: 5px;
        grid-row: auto;

    }

    .stud-detail-header {
        margin-bottom: 12px;
        /* my-3 */
    }
</style>
<div class="container">

    <div class="header-main">
        <img src="data:image/png;base64,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"
            alt="logo" height="150" width="150">
    </div>

    <div class="header-s">

        <div>
            <h5 class="b-header">Muster Schulungsvertrag - Teilnehmer/in</h5>
            <h5 class="b-header">kollektium GmbH</h5>
        </div>
        <div class="stud-detail-header">
            <p class="header">Name, Vorname: ${
              requestBody.studentName || "<student_name>"
            }</p>
            <p class="header">Anschrift: ${
              requestBody.address || "<student_address>"
            }</p>
            <p class="header">PLZ / Ort: ${
              requestBody.zipCode || "<zip_code>"
            }</p>

        </div>
        <h6 class="header">Maßnahmeninhalt</h6>

    </div>

    <div class="c-inner-container">
        <div class="section1">
            <h6 class="sub-header">§ 1 Inhalte</h6>

            <p class="header-content">Aufnahme und Dauer der Weiterbildungsmaßnahme</p>
            <p class="content">(1) Der / die Teilnehmende wird auf Grundlage der
                Kostenzusage des zuständigen Kostenträgers beruflich
                qualifiziert</p>

            <p class="content">(2) Der Titel der Maßnahme lautet: "${
              requestBody.courses
            }"
                mit den oben aufgeführten<br>
                Qualifizierungsinhalten und entsprechend nach dem
                aktuellen Arbeitsmarktanforderungen</p>

            <p class="content">(3) Die Maßnahme beginnt am ${
              requestBody.startDate || "<start_date>"
            } und endet am
               ${
                 requestBody.endDate || "<end_date>"
               } mit einem entsprechendem Zertifikat/
                Prüfung</p>

            <p class="content">Die Unterrichtszeiten betragen von Montag bis Freitag
                von 7.00 Uhr bis 15.00 Uhr mit einer Mittagspause von
                30 Minuten.</p>

            <p class="content">(4) In der Zeit der Maßnahme besteht folgender
                Urlaubsanspruch: _____Tage</p>

            <p class="content">(5) Der/ die Teilnehmende hat Anspruch auf ein Prak-
                tikum von ${weeks} Wochen über den erteilten Lehrstoff,
                über die Anwesenheit des Teilnehmers wird ein<br>
                Klassenbuch<br>
                geführt</p>

            <h6 class="sub-header">§ 2 Kosten</h6>
            <p class="content">(1) Die Kosten des Qualifizierungslehrgangs betragen
                € ${
                  requestBody.totalCost || "<total_cost>"
                }  (inkl. Arbeits- und Lehrmaterialien, siehe
                Anlage). Diese werden über den vom Teilnehmenden
                eingereichten Bildungsgutschein der Bundesagentur für</p>
        </div>


        <div class="section2">
            <p class="content">Arbeit oder Jobcenter abgerechnet. Dem Teilnehmer
                entstehen im Sinne der Maßnahmen keinerlei weitere
                Kosten.</p>
            <p class="content">(2) Der Bildungsträger ist berechtigt, die bewilligte
                Leistung direkt mit dem Kostenträger abzurechnen.</p>

            <h6 class="sub-header">§ 3 Pflichten des Teilnehmenden</h6>
            <p class="content">Der Teilnehmer verpflichtet sich den Anweisungen der
                Dozenten/-innen und der Leitung des Bildungsträgers
                Folge zu leisten. Des Weiteren hat der Teilnehmende
                sich an die Hausordnung zu halten. Bei Verstoß droht
                der Ausschluss aus der Maßnahme</p>

            <h6 class="sub-header">§ 4 Leistungen und Pflichten des Bildungsträgers</h6>
            <p class="content">Der Bildungsträger stellt dem Teilnehmenden einen
                Rahmenlehrplan und Stundenplan zur Verfügung. Der
                Weiterbildungsträger händigt dem Teilnehmenden nach
                Abschluss der Maßnahme eine
                Teilnahmebescheinigung mit Angaben zum Inhalt,
                zeitlichem Umfang und Ziel der Maßnahme aus.</p>



            <h6 class="sub-header">§ 5 Fehlzeiten</h6>
            <p class="content">Bei eintretenden Fehlzeiten (Krankheit etc.) verpflichtet
                sich der Teilnehmende, den Bildungsträger umgehend,
                bis spätestens 8.00 Uhr, zu informieren. Zudem sind Sie
                verpflichtet eine Arbeitsunfähigkeitsbescheinigung
                spätestens am dritten Tag einzureichen. Sollte der
                Teilnehmer innerhalb der ${weeks} Wochen
                Lehrgangstage mehr als 30% Tage fehlen, so ist das
                erfolgreiche Abschneiden der <br>
                Weiterbildungsmaßnahme gefährdet.</p>
        </div>
    </div>

    <div class="c-inner-container">
        <div class="section1">

            <h6 class="sub-header">§ 6 Versicherung</h6>
            <p class="content">Der Teilnehmende ist während der Unterrichts- und
                Wegezeiten in der gesetzlichen Unfallversicherung
                versichert. Haftpflichtschäden im Rahmen des
                Unterrichts sind über die Haftpflichtversicherung des
                Bildungsträgers abgedeckt.</p>

            <h6 class="sub-header">§ 7 Rücktrittsrecht</h6>
            <p class="content">(1) Der Vertrag endet mit dem Tag, an dem der / die
                Teilnehmende die Maßnahme gemäß Vertragszeitraum
                bzw. außerordentlich beendet hat.</p>

            <p class="content">(2) Der Vertrag kann von der / dem Teilnehmenden
                jederzeit durch schriftliche Erklärung mit einer Frist von
                vier Wochen zum Monatsende beendet werden. Der
                Bildungsträger unterrichtet hierüber unverzüglich den
                zuständigen Kostenträger. Der Vertrag kann ohne Frist
                gekündigt werden, wenn ein neues Arbeitsverhältnis
                unmittelbar bevorsteht.</p>

            <p class="content">(3) Der Bildungsträger kann das Vertragsverhältnis nur
                dann kündigen, wenn die Voraussetzungen für die
                Teilnahme an der Maßnahme nicht mehr gegeben sind
                und der Kostenträger seine Kostenzusage
                zurückgenommen hat.</p>

            <p class="content">(4) Nimmt der Kostenträger seine Kostenzusage zurück,
                endet dieser Vertrag mit dem Tag, der im
                bestandskräftigen Bescheid des Kostenträgers genannt
                ist. Für den / die Teilnehmende entstehen hierdurch
                keine Kosten.</p>

            <p class="content">(5) Der Vertrag endet mit dem Tag des Verlustes der
                Anerkennung des Bildungsträgers. Die
                Benachrichtigung der / des Teilnehmenden über diesen
                Sachverhalt hat unverzüglich schriftlich und spätestens
                nach Ablauf von fünf Arbeitstagen durch den
                Bildungsträger zu erfolgen</p>
        </div>

        <div class="section2">
            <p class="content">(6) Jede Vertragsbeendigung muss in schriftlicher Form
                erfolgen und von den betroffenen Vertragsparteien
                unterschrieben sein.</p>

            <p class="content">(7) Der Teilnehmer kann 14 Tage vor Beginn der
                Maßnahme schriftlich kündigen.</p>

            <h6 class="sub-header">§ 8 Datenschutz</h6>
            <p class="content">Der Teilnehmer ist damit einverstanden, dass die Daten
                an die Bundesagentur für Arbeit weiter gegeben werden
                dürfen.</p>

            <h6 class="sub-header">§ 9 Sonstiges</h6>
            <p class="content">Nebenabsprachen bedürfen der Schriftform und werden
                damit Bestandteil des Vertrages.</p>

            <h6 class="sub-header">§ 10 Abschlussbestimmungen</h6>
            <p class="content">Sollten einzelne Bestimmungen dieses Vertrages
                unwirksam oder undurchführbar sein oder nach
                Vertragsschluss unwirksam oder undurchführbar
                werden, bleibt davon die Wirksamkeit des Vertrages im
                Übrigen unberührt. An die Stelle der unwirksamen oder
                undurchführbaren Bestimmung soll diejenige wirksame
                und durchführbare Regelung treten, deren Wirkungen
                der wirtschaftlichen Zielsetzung am nächsten kommen,
                die die Vertragsparteien mit der unwirksamen bzw.
                undurchführbaren Bestimmung verfolgt haben. Die
                vorstehenden Bestimmungen gelten entsprechend für
                den Fall, dass sich der Vertrag als lückenhaft erweist.
                Änderungen und Irrtümer sind vorbehalten.</p>

            <p class="content">Hiermit stimme ich den Bedingungen mit meiner<br>Unterschrift zu.</p>

            <p class="header-content">Stand Juni 2021.</p>
        </div>
    </div>
    <div class="signature">
        <div class="row">
            <p class="sign-content">
                <span>Ort, Datum </span>
            </p>
            <p class="sign-content">
                <span>Unterschrift Bildungsträger</span>
            </p>
        </div>
        <div class="row ">
            <p class="sign-content">
                <span>Ort, Datum </span>
            </p>
            <p class="sign-content">
                <span>Unterschrift Teilnehmer/in.</span>
            </p>
        </div>
    </div>



</div>
      `;
    await page.goto(`data:text/html;charset=UTF-8,${html}`);

    await page.emulateMediaType("screen");

    const pdfBuffer = await page.pdf({
      path: "result.pdf",
      margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
      printBackground: true,
      format: "A4",
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=result.pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while generating the PDF.");
  }
}

function getWeeksBetweenDates(startDate, endDate) {
  // Convert the start and end dates to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the time difference in milliseconds
  const timeDiff = Math.abs(end - start);

  // Convert milliseconds to weeks (1 week = 7 * 24 * 60 * 60 * 1000 milliseconds)
  const weeks = Math.ceil(timeDiff / (7 * 24 * 60 * 60 * 1000));

  return weeks;
}
module.exports = generatePDF;
