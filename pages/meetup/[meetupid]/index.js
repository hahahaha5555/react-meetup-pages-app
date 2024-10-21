import React from 'react'
import { MongoClient, ObjectId } from 'mongodb'
import Head from 'next/head'
import MeetupDetail from '@/components/meetups/MeetupDetail'

const DetailPage = ({meetupData}) => {
    console.log(props.meetupData);
  return (
    <>
        <Head>
            <title>{meetupData.title}</title>
        </Head>
        <MeetupDetail 
            image={meetupData.image}
            title={meetupData.title}
            address={meetupData.address}
            description={meetupData.description}
        />
    </>
  )
}

export async function getStaticPaths() {
    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db('meetupDB');
    const meetupCollection = db.collection('meetups');
    const meetups = await meetupCollection.find({}, {_id: 1}).toArray();
    client.close();

    return {
        fallback: 'blocking',
        paths: meetups.map((meetup) => ({
          params: {
            meetupId: meetup._id.toString()
          }
        }))
      }
}  

export async function getStaticProps(context) {
    const meetupId = context.params.meetupId;

    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db('meetupDB');
    const meetupCollection = db.collection('meetups');

    const selectedMeetup = await meetupCollection.findOne({
      _id: ObjectId.createFromHexString(meetupId)
    })

    client.close();

    return {
        props: {
          meetupData: {
            id: selectedMeetup._id.toString(),
            title: selectedMeetup.title,
            address: selectedMeetup.address,
            image: selectedMeetup.image,
            description: selectedMeetup.description
          }
        }
      }
}    

export default DetailPage