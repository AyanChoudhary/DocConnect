import React, { useEffect, useState } from "react";
import { Layout, Card, Avatar, Skeleton } from "antd";
import { axiosInstance } from "api/axiosInstance";
import { useSelector } from "react-redux";
import "styles/main.scss";

const { Content } = Layout;
const { Meta } = Card;

const RenewConsultation = () => {
  const user = useSelector((state) => state.user);
  const [consultations, setConsultations] = useState([]);

  const getAppointments = (user) => {
    axiosInstance
      .get("/api/consultation/client/previous", {
        params: { client: user.email },
      })
      .then(function (response) {
        setConsultations(response.data.consultations);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const renewAppointment = (consultation) => {
    axiosInstance
      .post("/api/consultation/renewConsultation", {
        id: consultation._id,
        client: consultation.client,
        practitioner: consultation.practitioner,
        symptoms: consultation.symptoms,
        discomfortStart: consultation.discomfortStart,
        remarks: consultation.remarks,
      })
      .then(function (response) {
        getAppointments(user);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getAppointments(user);
  }, [user]);

  return (
    <Layout
      className="page"
      style={{
        position: "absolute",
        top: "4rem",
        left: 256,
      }}
    >
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 24,
          background: "#fff",
          height: "100%",
          width: "100%",
        }}
      >
        {consultations.length != 0 ? (
          consultations.map((consultation) => (
            <Card
              key={consultation._id}
              style={{ marginTop: 16 }}
              actions={[
                <p key="renew" onClick={() => renewAppointment(consultation)}>
                  Renew
                </p>,
              ]}
            >
              <Skeleton loading={false} avatar active>
                <Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={consultation.practitioner}
                  description={
                    "First signs of Discomfort: " +
                    consultation.discomfortStart +
                    ", Symptoms: " +
                    consultation.symptoms
                  }
                />
              </Skeleton>
            </Card>
          ))
        ) : (
          <h1 style={{ marginTop: "2rem" }}>No renewable appointments</h1>
        )}
      </Content>
    </Layout>
  );
};

export default RenewConsultation;
