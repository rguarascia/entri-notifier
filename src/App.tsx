import React, { useEffect, useState } from "react";
import { notification } from "@tauri-apps/api";
import {
  Button,
  Card,
  Container,
  Grid,
  NextUIProvider,
  Row,
  Text,
  Tooltip,
} from "@nextui-org/react";
import { NextUIBadge } from "./components/NextUICustoms";

function App() {
  const [providers, setProviders] = useState<any>([]);
  const displayNotification = () => {
    const godaddy = providers.filter(
      (provider: any) => provider.robot_code === "godaddy"
    )[0];

    notification.sendNotification({
      title: "Status alert",
      body: "Godaddy is online",
      icon: godaddy?.icon,
    });
  };

  useEffect(() => {
    fetch("https://api.goentri.com/providers")
      .then((res) => res.json())
      .then((data) => {
        setProviders(
          data?.data?.map((provider: any) => {
            return {
              ...provider,
              ui_status:
                (provider.entri_automation_enabled && provider.dashboard_ui) ||
                provider.domain_connect_enabled,
            };
          }) ?? []
        );
      });
  }, []);

  return (
    <NextUIProvider>
      <Container as={"main"} md fluid>
        <Button
          onClick={displayNotification}
          css={{
            m: "$10",
          }}
        >
          Display notification
        </Button>
        <Grid.Container gap={2}>
          {providers?.map((provider: any) => (
            <Grid key={provider.robot_code} css={{ w: "200px" }}>
              <Card
                css={{
                  boxShadow: `0 1px 7px ${
                    provider.ui_status
                      ? "rgb(7 188 12 / 25%)"
                      : "rgb(241 196 15 / 25%)"
                  }`,
                }}
              >
                <Card.Body css={{ p: 0, backgroundColor: "$white" }}>
                  <Card.Image
                    objectFit="contain"
                    src={provider.logo}
                    width="80%"
                    height={140}
                    alt={provider.robot_code}
                  />
                </Card.Body>
                <Card.Footer
                  css={{
                    border: "1px solid",
                    borderColor: provider.ui_status ? "$success" : "$warning",
                  }}
                >
                  <Row
                    wrap="wrap"
                    justify="flex-start"
                    css={{
                      display: "grid",
                      gridTemplateColumns: "auto",
                      gap: "$4",
                    }}
                  >
                    {provider.ui_status ? (
                      <NextUIBadge
                        status={provider.ui_status ? "active" : "vacation"}
                      >
                        {provider.ui_status ? "Active" : "Offline"}
                      </NextUIBadge>
                    ) : (
                      <Tooltip
                        placement="bottom"
                        css={{ width: "30ch" }}
                        content={
                          provider?.domain_connect_enabled
                            ? "It can take up to 5 business days for a provider to become enabled after you call the Entri API. If the issue persists, please contact your account manager."
                            : "Entri is experiencing connection issues with this provider. Users will be directed to setup their records manually until the issue is resolved."
                        }
                      >
                        <NextUIBadge
                          status={provider.ui_status ? "active" : "vacation"}
                        >
                          {provider.ui_status ? "Active" : "Offline"}
                        </NextUIBadge>
                      </Tooltip>
                    )}
                    <Text b>{provider.name}</Text>
                  </Row>
                </Card.Footer>
              </Card>
            </Grid>
          ))}
        </Grid.Container>
      </Container>
    </NextUIProvider>
  );
}

export default App;
