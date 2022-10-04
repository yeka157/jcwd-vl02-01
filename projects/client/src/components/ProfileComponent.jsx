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
  ModalContent,
  useToast,
} from "@chakra-ui/react";
import { HiXCircle } from "react-icons/hi";
import {API_URL} from "../helper";
import Axios from "axios";
import Cookies from "js-cookie";

export default function ProfileComponent(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const filePickerRef = React.useRef(null);
  const [images, setImages] = React.useState("");
  const [selectedImg, setSelectedImg] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [birthDate, setBirthDate] = React.useState();
  const [gender, setGender] = React.useState("");
  const [emailMsg, setEmailMsg] = React.useState("");
  const [emailClass, setEmailClass] = React.useState("");
  const [usersData, setUsersData] = React.useState([]);
  const [date, setDate] = React.useState('');

  const addImage = (e) => {
    console.log(e.target.files);
    if (e.target.files[0].type ==='image/png' || e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "image/jpg" || e.target.files[0].type === 'image/gif') {
      if (e.target.files[0].size > 1048576) {
        toast({
          title : 'File uploaded is too big',
          description : 'Max size is 1 MB',
          status : 'error',
          duration : 3000,
          isClosable : true
        })
      } else {
        setImages(e.target.files[0]);
        const reader = new FileReader();
        if (e.target.files[0]) {
          reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
          setSelectedImg(readerEvent.target.result);
        };
      }
    } else {
      toast({
        title : 'Wrong file format',
        description : 'Your file format is not supported',
        status : 'error',
        duration : 3000,
        isClosable : true
      })
    }
  };

  const btnSave = async () => {
    try {
      let token = Cookies.get('sehatToken');
      if (email) {
        if (emailMsg === "Email available") {
          let res = await Axios.patch(API_URL + "/user/update_profile", {
            fullName,
            email,
            birthDate,
            gender,
          }, {
            headers : {
              'Authorization' : `Bearer ${token}`
            }
          });
          if (res.data.success) {
            toast({
              description: "Profile successfully updated",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            onClose();
          }
        } else if (emailMsg === "Email already used") {
          toast({
            description: "Email already used",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        let res = await Axios.patch(API_URL + "/user/update_profile", {
          'name' : fullName,
          email,
          'birthdate' : birthDate,
          gender,
        }, {
          headers : {
            'Authorization' : `Bearer ${token}`
          }
        });
        if (res.data.success) {
          toast({
            description: "Profile successfully updated",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onClose();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    let findEmail = usersData.findIndex(val => val.email === email);
    let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email) {
      if (email === props.email) {
        setEmailMsg('');
      } else {
        if (email.match(mailFormat)) {
          if (findEmail < 0) {
            setEmailMsg('Email available');
            setEmailClass('text-green-400');
          } else {
            setEmailMsg('Email already exist');
            setEmailClass('text-red-500');
          }
        } else {
          setEmailMsg('Enter a valid email');
          setEmailClass('text-red-500');
        }
      }
    } else {
      setEmailMsg("");
    }
  }, [email, props.email, usersData]);

  React.useEffect(() => {
    getData();
    if (props.birth) {
      const date = new Date(props.birth);
      setDate(date.toLocaleDateString("en-GB", {
        weekday : 'long',
        day : 'numeric',
        month : 'long',
        year : 'numeric'
      }))
    }
  }, []);

  const getData = async () => {
    try {
      const getUsers = await Axios.get(API_URL + '/auth/get_all_users');
      setUsersData(getUsers.data);
    } catch (error) {
      console.log(error);
    }
  }

  const btnSaveImage = async () => {
    try {
      let token = Cookies.get('sehatToken');
      let formData = new FormData();
      formData.append('images', images);
      let res = await Axios.patch(API_URL + '/user/update_picture', formData, {
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      });
      if (res.data.success) {
        toast({
          title : 'Profile Picture Updated',
          status : 'success',
          duration : 3000,
          isClosable : true
        })
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="mx-32 my-16 w-full">
      <div className="flex justify-between space-x-10">
        <div className="flex space-x-10 grow">
          <div className="rounded-full border w-32 h-32 flex items-center justify-center border-black">
            <img
              src={props.picture ? 'http://localhost:8000' + props.picture : './default.jpg'}
              alt=""
              className="p-1 cursor-pointer hover:brightness-90 rounded-full"
              onClick={() => {
                setOpen(true);
              }}
            />
            <Modal
              isOpen={open}
              onClose={() => {
                setOpen(false);
              }}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Change Profile Picture</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <FormLabel>Profile Picture</FormLabel>
                    <div className="border p-2">
                      <Input
                        type="file"
                        hidden
                        ref={filePickerRef}
                        onChange={addImage}
                      />
                      <Button onClick={() => filePickerRef.current.click()}>
                        Browse
                      </Button>
                      {selectedImg && (
                        <div className="relative">
                          <HiXCircle
                            className="h-6 w-auto border m-1 p-1 border-white text-black absolute cursor-pointer font-bold rounded-full"
                            onClick={() => {
                              setSelectedImg(null);
                              setImages("");
                            }}
                          />
                          <img
                            src={selectedImg}
                            alt="profile-img"
                            className="mt-2"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                </ModalBody>
                <ModalFooter className="space-x-3">
                  <Button colorScheme="teal" onClick={btnSaveImage}>Save</Button>
                  <Button
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
          <div className="space-y-10 grow">
            <div className="space-y-7">
              <div>
                <h1 className="text-sm">Username</h1>
                <h1 className="text-gray-500">@{props.username}</h1>
              </div>
              <div>
                <h1 className="text-sm">Full Name</h1>
                <h1 className="text-gray-500">
                  {props.name ? props.name : props.username}
                </h1>
              </div>
              <div>
                <h1 className="text-sm">Birth date</h1>
                <h1 className="text-gray-500">{props.birth ? date : '-'}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4 flex flex-col">
          <div className="space-x-8">
            {props.status === "VERIFIED" ? (
              <></>
            ) : (
              <ButtonComponent
                text="Verify"
                py="2"
                px="8"
                brightness="90"
                class="border-hijauBtn border rounded-full hover:bg-hijauBtn hover:text-white font-medium"
              />
            )}
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
                    <Input
                      placeholder="Full Name"
                      type="text"
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      placeholder="Email"
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <h1 className={`text-sm mb-2 mx-2 ${emailClass}`}>
                      {emailMsg}
                    </h1>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Birth date</FormLabel>
                    <Input
                      type="date"
                      min="1922-01-01"
                      max="2022-09-29"
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      placeholder="Select Gender"
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </Select>
                  </FormControl>
                </ModalBody>
                <ModalFooter className="space-x-3">
                  <Button colorScheme="teal" onClick={btnSave}>
                    Save
                  </Button>
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
          <div className="py-4 space-y-7">
            <div className="flex space-x-5 items-center justify-start">
              <div>
                <h1 className="text-sm">Email</h1>
                <h1 className="text-gray-500">{props.email}</h1>
              </div>
              <div>
                <h1 className="text-sm">Gender</h1>
                <h1 className="text-gray-500">
                  {props.gender ? props.gender : "-"}
                </h1>
              </div>
            </div>
            <div className="mt-7">
              <h1 className="text-sm">Phone Number</h1>
              <h1 className="text-gray-500">(+62){props.phone}</h1>
            </div>
          </div>
        </div>
      </div>
      <AddressComponent user={props.iduser}/>
    </div>
  );
}
