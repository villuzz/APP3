cf login --sso
mbt build -s '/home/user/projects/PM030.APP3'; sleep 2;
cf deploy "/home/user/projects/PM030.APP3/mta_archives/APP3_0.0.1.mtar"
