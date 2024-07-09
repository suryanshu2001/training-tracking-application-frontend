import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, mergeMap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TopicsTableDataService {
  constructor(private _http: HttpClient) {}

  Index: string = 'http://localhost:5050/topics';

  // delete through ID
  addTopics(code: string, newData: any): Observable<any> {
    // fetch the existing data and then do conditional put request
    return this._http.get<any[]>(this.Index).pipe(
      mergeMap((data: any[]) => {
        const existingTopic = data.find((topic) => topic.code === code);
        // console.log(existingTopic);
        if (existingTopic) {
          existingTopic.topic.push(newData);

          return this._http.patch(
            `${this.Index}/${existingTopic.id}`,
            existingTopic
          );
        }
        // else
        const newTopic = {
          code: code,
          topic: [newData],
        };
        return this._http.post(`${this.Index}`, newTopic);
      })
    );
  }

  getTopics(): Observable<any> {
    return this._http.get(`${this.Index}`);
  }

  deleteTopics(code: string, topic: string): Observable<any> {
    // Fetch existing data
    return this._http.get<any[]>(this.Index).pipe(
      mergeMap((data: any[]) => {
        const existingTopic = data.find((topicCode) => topicCode.code === code);
        if (existingTopic) {
          // If topic with given code exists, remove the topic with the specified name
          const topicIndex = existingTopic.topic.findIndex((t: any) => {
            return t.topicName === topic;
          });
          console.log(topicIndex);
          if (topicIndex !== -1) {
            existingTopic.topic.splice(topicIndex, 1);

            // Update the topic in the database
            return this._http.patch(
              `${this.Index}/${existingTopic.id}`,
              existingTopic
            );
          } else {
            // If topic with given name doesn't exist, return an error or handle accordingly
            throw new Error(`Topic with name ${topic} not found.`);
          }
        } else {
          // If topic with given code doesn't exist, return an error or handle accordingly
          throw new Error(`Topic with code ${code} not found.`);
        }
      })
    );
  }

  editTopics(code: string, newData: any, topicName: string): Observable<any> {
    return this._http.get<any[]>(this.Index).pipe(
      mergeMap((data: any[]) => {
        const existingTopic = data.find((topicCode) => topicCode.code === code);
        if (existingTopic) {
          const topicIndex = existingTopic.topic.findIndex((t: any) => {
            return t.topicName === topicName;
          });
          if (topicIndex !== -1) {
            existingTopic.topic[topicIndex] = newData;
            return this._http.patch(
              `${this.Index}/${existingTopic.id}`,
              existingTopic
            );
          } else {
            throw new Error(`Topic with name ${topicName} not found.`);
          }
        } else {
          throw new Error(`Topic with code ${code} not found.`);
        }
      })
    );
  }
}
