import { NextPage, GetServerSideProps } from "next";
import { makeAuthUrl } from "@/lib/spotify";

const AuthSpotify: NextPage = () => <></>;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("location", makeAuthUrl());
  res.statusCode = 302;
  res.end();
  return { props: {} };
};

export default AuthSpotify;
