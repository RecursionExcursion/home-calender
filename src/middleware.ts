import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const routes = {
    dashboard: request.nextUrl.pathname.startsWith("/dashboard"),
    display: request.nextUrl.pathname.startsWith("/display"),
    login: request.nextUrl.pathname.startsWith("/login"),
    register: request.nextUrl.pathname.startsWith("/register"),
  };

  // const actions = {
  //   verifyUserCookie: async (request: NextRequest) => verifyUserCookie(request),
  // };

  // console.log({ request });
  // console.log({ url: request.url });
  // console.log({ nextUrl: request.nextUrl });
  // console.log({ orgin: request.nextUrl.origin });

  // TODO Currenlty not working, throwing erros upon extending the session from the login page
  // if (routes.login) {
  //   const userCookieIsValid = await actions.verifyUserCookie(request);

  //   if (userCookieIsValid) {
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }
  // }

  /* Protected by cookie auth */
  if (routes.dashboard || routes.display) {
    const userCookieIsValid = await verifyUserCookie(request);
    if (!userCookieIsValid) {
      const url = new URL("/login", `https://${request.nextUrl.host}`);

      console.log("User validation failed, redirecting to login page", url.toString());

      return NextResponse.redirect(new URL("/login", `https://${request.nextUrl.host}`));
    }
  }

  return NextResponse.next();
};

// export const config = {
//   matcher: ["/dashboard/:path*", "/display/:path*"],
// };

const verifyUserCookie = async (request: NextRequest) => {
  const cookie = request.cookies.get("user");

  if (!cookie) return false;

  const url = new URL("/api/auth", request.nextUrl.origin);

  console.log("Verifying user cookie as", url.toString());

  return await fetch(new URL("/api/auth", request.nextUrl.origin), {
    next: { revalidate: 0 },
    method: "POST",
    body: JSON.stringify(cookie.value),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((resp) => resp.ok);
};
