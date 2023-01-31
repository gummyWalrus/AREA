import 'package:area_front/sources/components/elevated_button.dart';
import 'package:area_front/sources/components/gradient_text.dart';
import 'package:area_front/sources/components/theme.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart' show kIsWeb;

class AreaDashboard extends StatefulWidget {
  const AreaDashboard({required this.userData, super.key});

  final Map userData;

  @override
  State<AreaDashboard> createState() => _AreaDashboardState();
}

class _AreaDashboardState extends State<AreaDashboard> {
  String areaId = "";
  int size = 0;
  void _fetchData(int index) async {
    areaId = widget.userData['areas'][index]['_id'];
    print('AREA ID : $areaId');
    final url =
        Uri.http(kIsWeb ? 'localhost:8080' : '10.0.2.2:8080', '/area/$areaId');
    final response = await http.delete(url, headers: <String, String>{
      'token': widget.userData['token'],
    });
    if (response.statusCode == 200) {
      setState(() {
        const snackBar = SnackBar(content: Text('Area deleted'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      });
    } else {
      setState(() {
        const snackBar = SnackBar(content: Text('Could not delete area'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      });
    }
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    print('USERDATA : ${widget.userData}');
    List list = [];
    widget.userData['areas'] != null ?  list.addAll(widget.userData['areas']) : null;
    size = list.length;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: Colors.transparent,
      body: Container(
        decoration: const BoxDecoration(gradient: themedGradient),
        child: Column(
          children: [
            Expanded(
              child: Container(
                margin: const EdgeInsets.only(
                    top: 50.0, left: 25.0, bottom: 25.0, right: 25.0),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(30),
                  color: Colors.white,
                ),
                child: size > 0
                    ? ListView.builder(
                        itemCount: size,
                        itemBuilder: (context, index) {
                          // print('USER DATA ${widget.userData}}');
                          return Padding(
                            padding: const EdgeInsets.all(50.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(widget.userData['areas']![index]['name']),
                                Text(widget.userData['areas']![index]['description']),
                                MyElevatedButton(
                                    onPressed: () {
                                      setState(() {
                                        _fetchData(index);
                                      });
                                    },
                                    borderRadius: BorderRadius.circular(30),
                                    gradient: themedGradient,
                                    child: const Text('Delete Area'))
                              ],
                            ),
                          );
                        },
                      )
                    : const Center(
                        child: GradientText(
                        'No areas found',
                        gradient: themedGradient,
                      )),
              ),
            )
          ],
        ),
      ),
    );
  }
}
