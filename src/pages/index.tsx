import LandingLayout from '@/components/Landing/Layout';
import { Button, Container, Overlay, Text, Title, createStyles, rem } from '@mantine/core';
import { type NextPage } from 'next';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingTop: rem(180),
    paddingBottom: rem(130),
    backgroundImage:
      'url(https://images.unsplash.com/photo-1573164713988-8665fc963095?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=980&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',

    [theme.fn.smallerThan('xs')]: {
      paddingTop: rem(80),
      paddingBottom: rem(50),
    },
  },

  inner: {
    position: 'relative',
    zIndex: 1,
  },

  title: {
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: rem(-1),
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    color: theme.white,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
      textAlign: 'left',
    },
  },

  highlight: {
    color: theme.colors[theme.primaryColor ?? 'dark']?.[4] ?? theme.colors.dark[4],
  },

  description: {
    color: theme.colors.gray[0],
    textAlign: 'center',

    [theme.fn.smallerThan('xs')]: {
      fontSize: theme.fontSizes.md,
      textAlign: 'left',
    },
  },

  controls: {
    marginTop: `calc(${theme.spacing.xl} * 1.5)`,
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  control: {
    height: rem(42),
    fontSize: theme.fontSizes.md,

    '&:not(:first-of-type)': {
      marginLeft: theme.spacing.md,
    },

    [theme.fn.smallerThan('xs')]: {
      '&:not(:first-of-type)': {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },

  secondaryControl: {
    color: theme.white,
    backgroundColor: 'rgba(255, 255, 255, .4)',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, .45) !important',
    },
  },
}));

const IndexPage: NextPage = () => {
  const { classes } = useStyles();

  return <LandingLayout>
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Bem-vindo à AuroryCrypto, <br />
          <Text component="span" inherit className={classes.highlight}>
            o futuro das suas transações financeiras!
          </Text>
        </Title>

        <Container size={640}>
          <Text size="lg" className={classes.description}>
            Na AuroryCrypto, acreditamos que o futuro financeiro é descentralizado, seguro e transparente. Em nossa plataforma, você tem acesso a um mundo de oportunidades com criptomoedas, desde armazenamento seguro até transações eficientes e sem fronteiras.
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button component={Link} href={'/auth/register'} className={classes.control} variant="white" size="lg">
            Crie Sua Conta Gratuitamente Agora
          </Button>
          {/* <Button className={cx(classes.control, classes.secondaryControl)} size="lg">
            Live demo
          </Button> */}
        </div>
      </div>
    </div>
  </LandingLayout>
}

export default IndexPage