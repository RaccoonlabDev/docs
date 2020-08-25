
# Inno.Uavcan.Node.Bin

This repositiory contains a set of binaries for flashing Node.

# (windows) st-link utility:

1. Download utility from st.com using [link](https://www.st.com/en/development-tools/stsw-link004.html)
2. ... run .exe file ...
3. ...


# (linux) st-link

You can use [official instructions](https://github.com/stlink-org/stlink#installation).

In ubuntu 18.04 the following set of instructions should also works:

1. Clone st-link repository somewhere

```
git clone https://github.com/stlink-org/stlink.git
```

2. Create a temporary directory, where you want to put the generated Makefiles, project files as well the object files and output binaries and enter there

```
cd stlink
mkdir -p _build && cd _build
```

3. Configuring. Run cmake

```
cmake -D CMAKE_INSTALL_PREFIX=$HOME/software/stlink ..
```

4. Build. From build directory execute make, it is recommended to do this in several threads

```
make -j4
```

4. Install. Execute the following command from build directory 

```
sudo make install
```

5. Set right and path to executable file

```
sudo chown -R `whoami`:`whoami` ~/software/stlink
export PATH="$HOME/software/stlink/bin:$PATH"
```

6. Add LD_LIBRARY_PATH

If you try to execute `st-flash --version` you will probably receive
   
```
st-flash: error while loading shared libraries: libstlink.so.1: cannot open shared object file: No such file or directory
```

so you should execute:

```
export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:$HOME/software/stlink/lib"
```

(you should change `$HOME/software/stlink` on your stlink path)

7. (optional) you can also add these line to your .bashrc, so as not to register them every time in a new session

```
export PATH="$HOME/software/stlink/bin:$PATH"
export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:$HOME/software/stlink/lib"
```

(you should change `$HOME/software/stlink` on your stlink path)

8. Flash your STM32

```
st-flash write node.bin 0x8000000
```

where `node.bin` is the the name of binary file