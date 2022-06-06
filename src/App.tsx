import { useEffect, useState } from "react";
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
import { iProvider } from "./types/iProviders";
import useDarkMode from "use-dark-mode";
import { darkTheme, lightTheme } from "./theme";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";

function App() {
  const darkMode = useDarkMode();

  const [providers, setProviders] = useState<iProvider[]>([]);
  const [prevProviders, setPrevProviders] = useState<iProvider[]>([]);

  const displayNotification = (provider: iProvider) => {
    notification.isPermissionGranted().then((isGranted) => {
      if (isGranted) {
        notification.sendNotification({
          title: "Status alert",
          body: `${provider.name} is offline`,
          icon: provider?.icon,
        });
      } else {
        askForPermission();
      }
    });
  };

  const askForPermission = () => {
    notification.requestPermission();
  };

  const fetchProviders = async () => {
    return await fetch("https://api.goentri.com/providers")
      .then((res) => res.json())
      .then((data) => {
        return (
          data?.data
            ?.map((provider: any) => {
              return {
                ...provider,
                ui_status:
                  (provider.entri_automation_enabled &&
                    provider.dashboard_ui) ||
                  provider.domain_connect_enabled,
              };
            })
            .sort((a: iProvider, b: iProvider) => {
              return b.ui_status - a.ui_status;
            }) ?? []
        );
      })
      .catch((err) => {
        return err;
      });
  };

  useEffect(() => {
    fetchProviders().then((data) => {
      setProviders(data);
    });

    const interval = setInterval(() => {
      fetchProviders().then((data) => {
        if (JSON.stringify(data) !== JSON.stringify(prevProviders)) {
          setProviders(data);
        }
      });
    }, 60 * 1000 * 5); // every 5 minutes

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!providers.length) return;
    console.info("Checking for changes");
    if (prevProviders.length === 0) {
      setPrevProviders(providers);
      return;
    }

    // Check if any provider has changed
    const changedProviders = providers.filter(
      (provider: iProvider) =>
        prevProviders.filter(
          (prevProvider: iProvider) =>
            prevProvider.robot_code === provider.robot_code
        )[0]?.ui_status !== provider.ui_status
    );

    changedProviders.forEach((element: iProvider) => {
      displayNotification(element);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providers]);

  return (
    <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
      <Container as={"main"} md fluid>
        <Grid
          css={{
            position: "absolute",
            right: "$12",
            top: "$12",
          }}
        >
          <Tooltip
            content={`Turn on ${darkMode.value ? "light" : "dark"} mode.`}
            onClick={darkMode.toggle}
            rounded
            placement="leftEnd"
            css={{
              width: "fit-content",
            }}
          >
            {darkMode.value ? (
              <MdOutlineLightMode size={24} />
            ) : (
              <MdDarkMode size={24} />
            )}
          </Tooltip>
        </Grid>

        <Text h2 margin={`$10 0 $8 $8`}>
          Entri Providers
        </Text>

        <Grid.Container gap={2}>
          {providers?.map((provider: any) => (
            <Grid key={provider.robot_code} css={{ w: "200px" }}>
              <Card
                css={{
                  boxShadow: `0px 1px ${darkMode.value ? "14px" : "7px"} ${
                    provider.ui_status
                      ? "rgb(7 188 12 / 25%)"
                      : "rgb(241 196 15 / 25%)"
                  }`,
                }}
              >
                <Card.Body
                  css={{
                    p: 0,
                    backgroundColor: darkMode.value ? "$accents8" : "$white",
                  }}
                >
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

        <Button
          size={"sm"}
          light
          onClick={askForPermission}
          css={{
            m: "$4",
          }}
        >
          Reask for notification permission
        </Button>
      </Container>
    </NextUIProvider>
  );
}

export default App;
