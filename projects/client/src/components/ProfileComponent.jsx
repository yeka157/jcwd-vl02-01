import React from "react";
import AddressComponent from "./AddressComponent";
import ButtonComponent from "./ButtonComponent";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Select,
  ModalFooter,
  Button,
  ModalContent, useToast
} from "@chakra-ui/react";
import { HiXCircle } from "react-icons/hi";
import API_URL from '../helper';
import Axios from 'axios';

export default function ProfileComponent(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const filePickerRef = React.useRef(null);
  const [images, setImages] = React.useState("");
  const [selectedImg, setSelectedImg] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [birthDate, setBirthDate] = React.useState();
  const [gender, setGender] = React.useState('');
  const [emailMsg, setEmailMsg] = React.useState('');
  const [emailClass, setEmailClass] = React.useState('');

  const addImage = (e) => {
    setImages(e.target.files[0]);
    const reader = new FileReader();
    if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
    };
    reader.onload = (readerEvent) => {
        setSelectedImg(readerEvent.target.result);
    }
  }
  
  const btnSave = async () => {
    try {
      if (email) {
        if (emailMsg === 'Email available') {
          let res = await Axios.patch(API_URL + '/user/update_profile', {
            fullName,
            email,
            birthDate,
            gender
          });
          if (res.data.success) {
            toast({
              description : 'Profile successfully updated',
              status : 'success',
              duration : 3000,
              isClosable : true
            })
            onClose();
          }
        } else if (emailMsg === 'Email already used'){
          toast({
            description : 'Email already used',
            status : 'error',
            duration : 3000,
            isClosable : true
          })
        }
      } else {
        let res = await Axios.patch(API_URL + '/user/update_profile', {
          fullName,
          email,
          birthDate,
          gender
        });
        if (res.data.success) {
          toast({
            description : 'Profile successfully updated',
            status : 'success',
            duration : 3000,
            isClosable : true
          })
          onClose();
        }
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    if (email) {
      setEmailMsg('Email available');
      setEmailClass('text-green-400')
    } else {
      setEmailMsg('');
    }
  }, [email])

  return (
    <div className="mx-32 my-16 w-full">
      <div className="flex justify-between space-x-10">
        <div className="flex space-x-10 grow">
          <div className="rounded-full border w-32 h-32 flex items-center justify-center border-black">
            <img src="./default.jpg" alt="" className="p-1 cursor-pointer hover:brightness-90 rounded-full" onClick={() => {setOpen(true)}}/>
            <Modal isOpen={open} onClose={()=> {setOpen(false)}}>
              <ModalOverlay/>
              <ModalContent>
                <ModalHeader>Change Profile Picture</ModalHeader>
                <ModalCloseButton/>
                <ModalBody pb={6}>
                <FormControl>
                    <FormLabel>Profile Picture</FormLabel>
                    <div className="border p-2">
                        <Input type='file' hidden ref={filePickerRef} onChange={addImage} />
                        <Button onClick={()=> filePickerRef.current.click()}>Browse</Button>
                        {selectedImg && (
                            <div className="relative">
                                <HiXCircle className="h-10 border m-1 border-white text-black absolute cursor-pointer font-bold rounded-full" onClick={()=> { setSelectedImg(null); setImages('');}}/>
                                <img src={selectedImg} alt='profile-img' className='mt-2'/>
                            </div>
                        )}
                    </div>
                  </FormControl>
                </ModalBody>
                <ModalFooter className="space-x-3">
                  <Button colorScheme='teal'>Save</Button>
                  <Button onClick={() => {setOpen(false)}}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
          <div className="space-y-10 grow">
            <div className="space-y-7">
              <div>
                <h1 className="text-sm">Username</h1>
                <h1 className="text-gray-500">@yuliuskevin</h1>
              </div>
              <div>
                <h1 className="text-sm">Full Name</h1>
                <h1 className="text-gray-500">Yulius Kevin</h1>
              </div>
              <div>
                <h1 className="text-sm">Birth date</h1>
                <h1 className="text-gray-500">31 May 2000</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4 flex flex-col">
          <div className="space-x-8">
            <ButtonComponent
              text="Verify"
              py="2"
              px="8"
              brightness="90"
              class="border-hijauBtn border rounded-full hover:bg-hijauBtn hover:text-white font-medium"
            />
            <ButtonComponent
              text="Edit Profile"
              py="2"
              px="8"
              brightness="90"
              class="border-hijauBtn border rounded-full hover:bg-hijauBtn hover:text-white font-medium"
              onclick={onOpen}
            />
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit Your Profile</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <FormLabel>Full Name</FormLabel>
                    <Input placeholder="Full Name" type='text' onChange={(e) => setFullName(e.target.value)}/>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input placeholder="Email" type='email' onChange={(e) => setEmail(e.target.value)}/>
                    <h1 className={`text-sm mb-2 mx-2 ${emailClass}`}>{emailMsg}</h1>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Birth date</FormLabel>
                    <Input type="date" min="1922-01-01" max="2022-09-29" onChange={(e) => setBirthDate(e.target.value)}/>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Gender</FormLabel>
                    <Select placeholder="Select Gender" onChange={(e) => setGender(e.target.value)}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="none">Prefer not to say</option>
                    </Select>
                  </FormControl>
                </ModalBody>
                <ModalFooter className="space-x-3">
                  <Button colorScheme='teal' onClick={btnSave}>Save</Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <ButtonComponent
              text="Change Password"
              py="2"
              px="8"
              brightness="90"
              class="border-hijauBtn border rounded-full hover:bg-hijauBtn hover:text-white font-medium"
            />
          </div>
          <div className="space-y-7 py-4">
            <div>
              <h1 className="text-sm">Email</h1>
              <h1 className="text-gray-500">yuliuskevin66@gmail.com</h1>
            </div>
            <div>
                <h1 className="text-sm">Gender</h1>
                <h1 className="text-gray-500">MALE</h1>
            </div>
          </div>
        </div>
      </div>
      <AddressComponent />
    </div>
  );
}
