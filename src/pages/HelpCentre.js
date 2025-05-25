import React from 'react';
import Layout from '../components/Layout';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BarChart2, Upload, LineChart, FileText } from 'lucide-react';

function HelpCentre() {
  return (
    <Layout>
      <Container className="py-4">
        <h2 className="mb-4">Hi, how can we help ?</h2>
        <Row className="mb-5 text-center">
          <Col md={3} sm={6} xs={12} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-center mb-3">
                  <BarChart2
                    size={40}
                    className="text-success"
                    style={{ color: '#10d327' }}
                  />
                </div>
                <Card.Title>Dashboard</Card.Title>
                <Card.Text>
                  Get a quick overview of key metrics and recent activity.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} xs={12} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-center mb-3">
                  <Upload size={40} className="text-primary" />
                </div>
                <Card.Title>Upload Sheets</Card.Title>
                <Card.Text>
                  Easily upload and manage your data sheets in one place.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} xs={12} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-center mb-3">
                  <LineChart size={40} className="text-info" />
                </div>
                <Card.Title>Analytics</Card.Title>
                <Card.Text>
                  Dive deep into data trends and performance insights.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} xs={12} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-center mb-3">
                  <FileText size={40} className="text-danger" />
                </div>
                <Card.Title>Reports</Card.Title>
                <Card.Text>
                  Generate, view, and download detailed reports.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
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
      </Container>
    </Layout>
  );
}

export default HelpCentre;
