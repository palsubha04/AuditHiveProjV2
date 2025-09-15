import React, { useState } from "react";
import Layout from "../components/Layout";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  ButtonGroup,
} from "react-bootstrap";
import { BarChart2, Upload, LineChart, FileText, Eye, Download } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `/react-pdf/pdf.worker.mjs`;

const HelpCentre = () => {
  const [showModal, setShowModal] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.2);

  const pdfPath = "/help-center/png_tax_project_Stages_2.2.3_submitted to IRC.pdf";

  // Handlers
  const handleView = () => {
    setNumPages(null); // reset before loading again
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = "png_tax_project_Stages_2.2.3_submitted to IRC.pdf";
    link.click();
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages((prev) => prev ?? numPages);
  };
  // Zoom controls
  const zoomIn = () => setScale((prev) => prev + 0.2);
  const zoomOut = () => setScale((prev) => (prev > 0.6 ? prev - 0.2 : 0.6));
  const resetZoom = () => setScale(1.2);

  // Cards data
  const helpCards = [
    {
      icon: (
        <BarChart2
          size={40}
          className="text-success"
          style={{ color: "#10d327" }}
        />
      ),
      title: "Dashboard",
      text: "Get a quick overview of key metrics and recent activity.",
    },
    {
      icon: <Upload size={40} className="text-primary" />,
      title: "Upload Sheets",
      text: "Easily upload and manage your data sheets in one place.",
    },
    {
      icon: <LineChart size={40} className="text-info" />,
      title: "Analytics",
      text: "Dive deep into data trends and performance insights.",
    },
    {
      icon: <FileText size={40} className="text-danger" />,
      title: "Reports",
      text: "Generate, view, and download detailed reports.",
    },
  ];

  return (
    <Layout>
      <div className="py-3">
        {/* Feature Cards */}
        <Row className="mb-2 text-center">
          {helpCards.map((card, idx) => (
            <Col key={idx} md={3} sm={6} xs={12} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-center mb-3">
                    {card.icon}
                  </div>
                  <Card.Title>{card.title}</Card.Title>
                  <Card.Text>{card.text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Info Section */}
        <div>
          <p>
            Help Center pages provide information about how to use a particular
            product or service. The main purpose of these pages is to support
            users and help them find answers to their questions. They can also
            provide information on the product’s functionalities, as well as its
            core features and limitations.
          </p>
          <p>
            These pages are great resources for both businesses and users, as
            they allow the latter to independently find answers and solutions
            and businesses to reduce costs by not investing in direct customer
            support. Well-designed help center pages are user-friendly,
            organized, and regularly updated to ensure that users have access to
            accurate and relevant information.
          </p>
          <h5 className="mt-5">
            What is the difference between a help center and a support page?
          </h5>
          <p>
            Help Center pages are resources or guides to help users find
            answers. On the other hand, support pages incorporate chatbots,
            email links, forms, etc. to provide a form of direct support to the
            users.
          </p>
          <h5 className="mt-5">
            What should a well-designed help centre page include?
          </h5>
          <p>
            As a general guideline, it should include at least the following
            areas:
          </p>
          <ol>
            <li>
              <strong>Product Documentation:</strong> This is a technical
              document that outlines all the main details of your
              product/service. It is a guide that allows users to get maximum
              value by including product specifications, instructions, and more.
            </li>
            <li>
              <strong>Frequently Asked Questions:</strong> The FAQ section
              allows users to access popular topics to solve their problems. It
              is a time-saving asset for both the user and the owner.
            </li>
          </ol>
        </div>

        {/* Rules Section */}
        <div className="mt-5">
          <h5>Rules</h5>
          <p>Here is the sample PDF with guidelines:</p>
          <div className="d-flex align-items-center gap-3">
            <span>
              <strong>png_tax_project_Stages_2.2.3_submitted to IRC.pdf</strong>
            </span>
            <button
              className="sample-card-btn"
              onClick={handleView}
            >
              <Eye size={18} />
            </button>
            <button
              className="sample-card-btn"
              onClick={handleDownload}
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* PDF Modal */}
        <Modal show={showModal} onHide={handleClose} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>View PDF</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
            <Document file={pdfPath} onLoadSuccess={onDocumentLoadSuccess}>
              {numPages &&
                Array.from({ length: numPages }, (_, index) => (
                  <div key={`page_${index + 1}`} className="mb-4">
                    <Page pageNumber={index + 1} scale={scale} />
                    <p className="text-muted small">
                      Page {index + 1} of {numPages}
                    </p>
                  </div>
                ))}
            </Document>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            {/* Zoom Controls */}
            <ButtonGroup>
              <Button variant="outline-primary" onClick={zoomOut}>
                Zoom Out
              </Button>
              <Button variant="outline-primary" onClick={resetZoom}>
                Reset
              </Button>
              <Button variant="outline-primary" onClick={zoomIn}>
                Zoom In
              </Button>
            </ButtonGroup>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
};

export default HelpCentre;
