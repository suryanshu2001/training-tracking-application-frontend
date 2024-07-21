import { Injectable } from '@angular/core';
import { JwtPayload } from '../../admin/shared/models/jwt-payload.model';
import { jwtDecode } from 'jwt-decode';
import { UserDetails } from '../../admin/shared/models/user-details.model';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }





  decodeJwt(token: string): JwtPayload {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded;
    } catch (error) {
      console.error("Invalid token");
      return null as any; // Handle invalid token scenario
    }
  }

  parseUserDetails(sub: string): any {
    try {
      const userDetails = sub;
      return userDetails;
    } catch (error) {
      console.error("Failed to parse user details:", error);
      return null as any; // Handle parsing errors
    }
  }

  // // Example usage
  // const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJwYXNzd29yZFwiOlwiJTIwJTIwY28zQmxlUnphakVqJTIwJTIwM2RlN2Fuc3dheEVwNVc4a0dWSSIsXCJ1c2VybmFtZVwiOlwiTmV3VXNlcjRAZ21haWwuY29tXCIsXCJhdXRob3JpdGllc1wiOlt7XCJhdXRob3JpdHlcIjpcIk9STF90ZWFjaGVyXCJ9XSxcImFjY291bnROb25FeHBpcmVkXCI6dHJ1ZSxcImFjY291bnROb25Mb2NrZWRcIjp0cnVlLFwiY3JlZGVudGlhbHNOb25FeHBpcmVkXCI6dHJ1ZSxcImVuYWJsZWRcIjp0cnVlIn0iLCJleHB4IjoyNzIxNzQ2MTMsImlhdCI6MTcyMTU2NzE5M30.5n3wzGC9Bh0lHrlT4Ir46X8TqV3uF44XZpW9ltIRvR8Jb6UwGvHws_7coP8X0waF_mGoCgcnY5XCBqjIZ3UeEg";

  // const decodedPayload = decodeJwt(token);
  // if (decodedPayload) {
  //   const userDetails = parseUserDetails(decodedPayload.sub);
  //   console.log("User Details:", userDetails);
  // }
}
