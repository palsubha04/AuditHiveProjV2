import React, { useState } from "react";
import Layout from "../components/Layout";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";
import { BarChart2, Upload, LineChart, FileText, Eye, Download } from "lucide-react";

const HelpCentre = () => {
  const [showPlaceholder, setShowPlaceholder] = useState(false); // if you need any small placeholder state
  const pdfPath = "/help-center/png_tax_project_Stages_2.2.3_submitted to IRC.pdf";

  // Handlers
  const handleView = () => {
    // Open PDF in a new tab/window (browser will use built-in PDF viewer if available)
    const newWin = window.open(pdfPath, "_blank");
    if (newWin) newWin.focus();
    else {
      // fallback: inform user (you can improve with a toast)
      setShowPlaceholder(true);
      console.warn("Popup blocked. Please allow popups or use the Download button.");
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = "png_tax_project_Stages_2.2.3_submitted to IRC.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

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
              title="View in new tab"
            >
              <Eye size={18} />
            </button>
            <button
              className="sample-card-btn"
              onClick={handleDownload}
              title="Download"
            >
              <Download size={18} />
            </button>
          </div>

          {showPlaceholder && (
            <p className="text-muted small mt-2">
              If the PDF didn't open, your browser may be blocking pop-ups. Use
              the download button or allow pop-ups for this site.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HelpCentre;
